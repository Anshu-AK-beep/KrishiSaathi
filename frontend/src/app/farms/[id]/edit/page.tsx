'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, MapPin, Droplets, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  soilType: string;
  soilPh?: number;
  irrigationType: string;
  farmOwnership: string;
  farmingType: string;
  primaryCrops: string[];
  farmingExperienceYears?: number;
  latitude?: number;
  longitude?: number;
}

export default function EditFarmPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const farmId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Farm>({
    id: '',
    name: '',
    location: '',
    totalArea: 0,
    soilType: 'LOAMY',
    soilPh: 7,
    irrigationType: 'DRIP',
    farmOwnership: 'OWNED',
    farmingType: 'ORGANIC',
    primaryCrops: [],
    farmingExperienceYears: 0,
    latitude: undefined,
    longitude: undefined,
  });

  useEffect(() => {
    const fetchFarm = async () => {
      try {
        const response = await fetch(`/api/farms/${farmId}`);
        if (!response.ok) throw new Error('Failed to fetch farm');
        const data = await response.json();
        setFormData(data);
      } catch (err) {
        toast({
          title: t('error'),
          description: 'Failed to load farm data',
          variant: 'destructive',
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (farmId) fetchFarm();
  }, [farmId, toast, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/farms/${farmId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          totalArea: parseFloat(formData.totalArea.toString()),
          soilType: formData.soilType,
          soilPh: formData.soilPh ? parseFloat(formData.soilPh.toString()) : null,
          irrigationType: formData.irrigationType,
          farmOwnership: formData.farmOwnership,
          farmingType: formData.farmingType,
          primaryCrops: formData.primaryCrops,
          farmingExperienceYears: formData.farmingExperienceYears,
          latitude: formData.latitude,
          longitude: formData.longitude,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update farm');
      }

      toast({
        title: t('success'),
        description: t('updateSuccess'),
      });

      router.push('/farms');
      router.refresh();
    } catch (err: any) {
      toast({
        title: t('error'),
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['totalArea', 'soilPh', 'farmingExperienceYears', 'latitude', 'longitude'].includes(name)
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCropsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const crops = e.target.value.split(',').map(crop => crop.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, primaryCrops: crops }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/farms')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('editFarm')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t('updateFarm')} - {formData.name}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                {t('required')} fields are marked with *
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Farm Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  {t('farmName')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('enterValue')}
                  className="bg-background border-input"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('location')} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder={t('enterValue')}
                  className="bg-background border-input resize-none"
                />
              </div>

              {/* Two Column Layout for Area and Soil pH */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Area */}
                <div className="space-y-2">
                  <Label htmlFor="totalArea" className="text-foreground">
                    {t('area')} ({t('acres')}) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="totalArea"
                    name="totalArea"
                    type="number"
                    value={formData.totalArea}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0"
                    placeholder="0.0"
                    className="bg-background border-input"
                  />
                </div>

                {/* Soil pH */}
                <div className="space-y-2">
                  <Label htmlFor="soilPh" className="text-foreground">
                    {t('soilPh')} <span className="text-muted-foreground">({t('optional')})</span>
                  </Label>
                  <Input
                    id="soilPh"
                    name="soilPh"
                    type="number"
                    value={formData.soilPh || ''}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="14"
                    placeholder="7.0"
                    className="bg-background border-input"
                  />
                </div>
              </div>

              {/* Farming Experience */}
              <div className="space-y-2">
                <Label htmlFor="farmingExperienceYears" className="text-foreground">
                  {t('farmingExperience')} ({t('years')})
                </Label>
                <Input
                  id="farmingExperienceYears"
                  name="farmingExperienceYears"
                  type="number"
                  value={formData.farmingExperienceYears || ''}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="bg-background border-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Soil & Irrigation Card */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                {t('soilType')} & {t('irrigationType')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Soil Type */}
                <div className="space-y-2">
                  <Label htmlFor="soilType" className="text-foreground">
                    {t('soilType')} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.soilType}
                    onValueChange={(value) => handleSelectChange('soilType', value)}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLAY">{t('clay')}</SelectItem>
                      <SelectItem value="LOAMY">{t('loamy')}</SelectItem>
                      <SelectItem value="SANDY">{t('sandy')}</SelectItem>
                      <SelectItem value="SILTY">{t('silty')}</SelectItem>
                      <SelectItem value="PEATY">{t('peaty')}</SelectItem>
                      <SelectItem value="CHALKY">{t('chalky')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Irrigation Type */}
                <div className="space-y-2">
                  <Label htmlFor="irrigationType" className="text-foreground">
                    {t('irrigationType')} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.irrigationType}
                    onValueChange={(value) => handleSelectChange('irrigationType', value)}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRIP">{t('drip')}</SelectItem>
                      <SelectItem value="SPRINKLER">{t('sprinkler')}</SelectItem>
                      <SelectItem value="FLOOD">{t('flood')}</SelectItem>
                      <SelectItem value="CANAL">{t('canal')}</SelectItem>
                      <SelectItem value="WELL">{t('well')}</SelectItem>
                      <SelectItem value="RAINFED">{t('rainfed')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm Management Card */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle>Farm Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Farm Ownership */}
                <div className="space-y-2">
                  <Label htmlFor="farmOwnership" className="text-foreground">
                    {t('farmOwnership')} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.farmOwnership}
                    onValueChange={(value) => handleSelectChange('farmOwnership', value)}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OWNED">{t('owned')}</SelectItem>
                      <SelectItem value="LEASED">{t('leased')}</SelectItem>
                      <SelectItem value="SHARED">{t('shared')}</SelectItem>
                      <SelectItem value="RENTED">{t('rented')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Farming Type */}
                <div className="space-y-2">
                  <Label htmlFor="farmingType" className="text-foreground">
                    {t('farmingType')} <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.farmingType}
                    onValueChange={(value) => handleSelectChange('farmingType', value)}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORGANIC">{t('organic')}</SelectItem>
                      <SelectItem value="CONVENTIONAL">{t('conventional')}</SelectItem>
                      <SelectItem value="MIXED">{t('mixed')}</SelectItem>
                      <SelectItem value="SUSTAINABLE">{t('sustainable')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Primary Crops */}
              <div className="space-y-2">
                <Label htmlFor="primaryCrops" className="text-foreground">
                  {t('primaryCrops')} <span className="text-muted-foreground">({t('commaSeparated')})</span>
                </Label>
                <Input
                  id="primaryCrops"
                  value={formData.primaryCrops.join(', ')}
                  onChange={handleCropsChange}
                  placeholder="e.g., WHEAT, RICE, CORN"
                  className="bg-background border-input"
                />
                {formData.primaryCrops.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.primaryCrops.map((crop, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Coordinates Card (Optional) */}
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t('coordinates')} <span className="text-muted-foreground text-sm font-normal">({t('optional')})</span>
              </CardTitle>
              <CardDescription>
                Add GPS coordinates for precise location mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Latitude */}
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-foreground">
                    {t('latitude')}
                  </Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    value={formData.latitude || ''}
                    onChange={handleChange}
                    step="0.000001"
                    placeholder="e.g., 28.6139"
                    className="bg-background border-input"
                  />
                </div>

                {/* Longitude */}
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-foreground">
                    {t('longitude')}
                  </Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    value={formData.longitude || ''}
                    onChange={handleChange}
                    step="0.000001"
                    placeholder="e.g., 77.2090"
                    className="bg-background border-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('updateFarm')}
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/farms')}
              className="flex-1 border-border hover:bg-muted"
              disabled={submitting}
            >
              {t('cancel')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}