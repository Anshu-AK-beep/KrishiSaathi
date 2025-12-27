import { useGetUsers } from "@/hooks/use-users";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EditIcon, MailIcon, PhoneIcon, PlusIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AddFarmerDialog from "@/app/admin/AddFarmerDialog";
import EditFarmerDialog from "@/app/admin/EditFarmerDialog";
import { User } from "@prisma/client";

function FarmersManagement() {
  const { data: farmers = [] } = useGetUsers("FARMER");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);

  const handleEditFarmer = (farmer: User) => {
    setSelectedFarmer(farmer);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedFarmer(null);
  };

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Farmers Management
            </CardTitle>
            <CardDescription>Manage and oversee all registered farmers on your platform</CardDescription>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/100"
          >
            <PlusIcon className="mr-2 size-4" />
            Add Farmer
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {farmers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="size-12 mx-auto mb-4 opacity-20" />
                <p>No farmers registered yet</p>
              </div>
            ) : (
              farmers.map((farmer) => (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background">
                      <Users className="size-6 text-primary" />
                    </div>

                    <div>
                      <div className="font-semibold">{farmer.fullName || "Unnamed Farmer"}</div>
                      <div className="text-sm text-muted-foreground">
                        {farmer.languagePreference === "hi" ? "Hindi" : farmer.languagePreference === "en" ? "English" : farmer.languagePreference}

                        <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                          {farmer.role}
                        </span>
                        {farmer.isVerified && (
                          <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MailIcon className="h-3 w-3" />
                          {farmer.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PhoneIcon className="h-3 w-3" />
                          {farmer.countryCode} {farmer.phoneNumber || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="font-semibold text-primary">
                        {(farmer as any)._count?.predictions || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Predictions</div>
                    </div>

                    {farmer.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => handleEditFarmer(farmer)}
                    >
                      <EditIcon className="size-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddFarmerDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />

      <EditFarmerDialog
        key={selectedFarmer?.id}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        farmer={selectedFarmer}
      />
    </>
  );
}

export default FarmersManagement;