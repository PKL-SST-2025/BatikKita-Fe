// Simple test API utility to bypass CORS issues during development
export const testApiCall = async (endpoint: string, options: RequestInit = {}) => {
  // For development, we'll use direct fetch without proxy
  const baseUrl = 'http://127.0.0.1:8080/api';
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    mode: 'cors',
    credentials: 'omit', // Don't send credentials for now
  };

  try {
    console.log(`Making request to: ${url}`);
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Response received:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Test function to check if backend is running
export const testBackendConnection = async () => {
  try {
    const result = await testApiCall('/health');
    console.log('Backend connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};
