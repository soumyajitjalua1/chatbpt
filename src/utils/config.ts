interface Config {
  openaiApiKey: string | null;
  azureEndpoint: string | null;
  // mongodbUri: string | null; // Removed from frontend config
}

// Load configuration securely from environment variables
const loadConfig = (): Config => {
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY || null;
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT || null;

  if (!apiKey || !endpoint) {
    console.warn(
      'Azure OpenAI API Key or Endpoint is not configured in .env file. '
      + 'Please set VITE_AZURE_OPENAI_API_KEY and VITE_AZURE_OPENAI_ENDPOINT.'
    );
  }

  return {
    openaiApiKey: apiKey,
    azureEndpoint: endpoint,
  };
};

// Remove saveConfig as keys are now managed via .env
// const saveConfig = (...) => { ... };

// Only export loadConfig and the type
export { loadConfig, type Config };
