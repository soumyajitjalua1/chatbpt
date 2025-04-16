/**
 * Performs a fetch request, automatically including credentials (cookies)
 * and setting Content-Type to application/json.
 * Throws an error for non-ok responses, attempting to parse error details from JSON.
 */
export const fetchWithCredentials = async <T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T | null> => {
    
    const response = await fetch(url, {
        ...options,
        credentials: 'include', // Crucial for sending/receiving cookies
        headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        },
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            // If response is not JSON or empty
            errorData = { message: `HTTP error! Status: ${response.status}` };
        }
        // Use the message from the parsed error data if available
        throw new Error(errorData?.message || 'API request failed');
    }

    // Check if the response has content before trying to parse JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        // Use generic type T for the resolved value
        return await response.json() as T;
    } else {
        // Handle responses with no content (like a successful logout or delete)
        return null; 
    }
}; 