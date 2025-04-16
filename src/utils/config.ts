
interface Config {
  openaiApiKey: string | null;
  azureEndpoint: string | null;
  mongodbUri: string | null;
}

// This is a temporary solution. In production, use Supabase for secure credential management
const loadConfig = (): Config => {
  return {
    openaiApiKey: localStorage.getItem('openai_api_key'),
    azureEndpoint: localStorage.getItem('azure_endpoint'),
    mongodbUri: localStorage.getItem('mongodb_uri')
  };
};

const saveConfig = (config: Partial<Config>) => {
  if (config.openaiApiKey) localStorage.setItem('openai_api_key', config.openaiApiKey);
  if (config.azureEndpoint) localStorage.setItem('azure_endpoint', config.azureEndpoint);
  if (config.mongodbUri) localStorage.setItem('mongodb_uri', config.mongodbUri);
};

export { loadConfig, saveConfig, type Config };
