// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error_code?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  message: string;
}

// Auth Token Management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// API Client Class
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = getAuthToken();

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      // Use origin-when-cross-origin for better CORS handling
      referrerPolicy: 'origin-when-cross-origin',
      // Include credentials for CORS
      credentials: 'include',
      // Add mode for explicit CORS handling
      mode: 'cors',
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response has content and is JSON before parsing
      let data;
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      if (hasJsonContent) {
        try {
          data = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, create a generic error response
          data = {
            success: false,
            message: `Failed to parse response: ${response.status} ${response.statusText}`,
            data: null
          };
        }
      } else {
        // For non-JSON responses (like 404 HTML pages), create a generic error response
        data = {
          success: false,
          message: response.status === 404 ? 'Resource not found' : `HTTP ${response.status}: ${response.statusText}`,
          data: null
        };
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, redirect to login
          removeAuthToken();
          window.location.href = '/login';
        }
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Paginated GET request
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
    }
    
    const url = searchParams.toString() 
      ? `${endpoint}?${searchParams.toString()}`
      : endpoint;
    
    return this.request<any>(url, { method: 'GET' }) as Promise<PaginatedResponse<T>>;
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility function for handling API errors
export const handleApiError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
