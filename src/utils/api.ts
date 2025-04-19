const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchWithCredentials = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> => {
  const url = `${BASE_URL}${path}`;

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
      errorData = { message: `HTTP error! Status: ${response.status}` };
    }
    throw new Error(errorData?.message || 'API request failed');
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json() as T;
  } else {
    return null;
  }
};
