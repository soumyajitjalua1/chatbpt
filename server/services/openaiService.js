require('dotenv').config();

const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_DEPLOYMENT_NAME = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt4ostructuredoutput'; // Or get from env
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview'; // Or get from env

/**
 * Calls the configured Azure OpenAI endpoint to get a chat completion.
 * @param {Array<{role: string, content: string}>} messages - The message history for context.
 * @returns {Promise<string>} - The content of the AI's response.
 * @throws {Error} - If the API call fails or keys/endpoint are missing.
 */
const getAzureChatCompletion = async (messages) => {
    if (!AZURE_API_KEY || !AZURE_ENDPOINT) {
        throw new Error('Azure OpenAI API Key or Endpoint is not configured on the server.');
    }

    // Construct the full API URL
    const apiUrl = `${AZURE_ENDPOINT.replace(/\/$/, '')}/openai/deployments/${AZURE_DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_API_VERSION}`;

    const headers = {
        'api-key': AZURE_API_KEY,
        'Content-Type': 'application/json',
    };

    const body = {
        messages: messages, // Pass the message history
        temperature: 0.7, // Or make configurable
        // Add other parameters like max_tokens if needed
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
            console.error('Azure OpenAI Error response:', errorData);
            // Provide a more specific error message if possible
            const detail = errorData?.error?.message || errorData?.message || `HTTP ${response.status}`;
            throw new Error(`Failed to get response from Azure OpenAI: ${detail}`);
        }

        const data = await response.json();
        const aiResponseContent = data.choices?.[0]?.message?.content;

        if (!aiResponseContent) {
            console.error('Azure OpenAI Response missing content:', data);
            throw new Error('Received empty response content from Azure OpenAI.');
        }

        return aiResponseContent;

    } catch (error) {
        console.error('Error calling Azure OpenAI API:', error);
        // Re-throw the error to be caught by the controller
        throw error; 
    }
};

module.exports = { getAzureChatCompletion }; 