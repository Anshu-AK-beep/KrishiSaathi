import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

function VapiNotConfigured() {
  return (
    <Card className="border-2 border-amber-500/20 bg-amber-500/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-amber-600" />
          <CardTitle>Voice Assistant Not Configured</CardTitle>
        </div>
        <CardDescription>
          To enable the AI voice assistant, you need to set up Vapi integration.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p className="font-medium">Setup Instructions:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Sign up for a free account at <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vapi.ai</a></li>
            <li>Create a new AI assistant</li>
            <li>Get your API key and Assistant ID</li>
            <li>Add them to your <code className="px-1 py-0.5 bg-muted rounded text-xs">.env.local</code> file:</li>
          </ol>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg font-mono text-xs">
          <div>NEXT_PUBLIC_VAPI_API_KEY=your_api_key</div>
          <div>NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id</div>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="https://vapi.ai" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" />
              Go to Vapi.ai
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="https://docs.vapi.ai" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 size-4" />
              View Documentation
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default VapiNotConfigured;