
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { loadConfig, saveConfig } from '@/utils/config';

const ApiKeySetup = () => {
  const { toast } = useToast();
  const config = loadConfig();
  const [openaiKey, setOpenaiKey] = useState(config.openaiApiKey || '');
  const [azureEndpoint, setAzureEndpoint] = useState(config.azureEndpoint || '');
  const [mongoUri, setMongoUri] = useState(config.mongodbUri || '');

  const handleSave = () => {
    saveConfig({
      openaiApiKey: openaiKey,
      azureEndpoint: azureEndpoint,
      mongodbUri: mongoUri
    });
    
    toast({
      title: "Configuration saved",
      description: "Your API keys have been saved securely.",
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">API Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <Input
            type="password"
            value={openaiKey}
            onChange={(e) => setOpenaiKey(e.target.value)}
            placeholder="sk-..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Azure Endpoint
          </label>
          <Input
            type="text"
            value={azureEndpoint}
            onChange={(e) => setAzureEndpoint(e.target.value)}
            placeholder="https://..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MongoDB URI
          </label>
          <Input
            type="password"
            value={mongoUri}
            onChange={(e) => setMongoUri(e.target.value)}
            placeholder="mongodb://..."
          />
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Save Configuration
        </Button>
      </div>
    </Card>
  );
};

export default ApiKeySetup;
