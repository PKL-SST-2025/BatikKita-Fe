import { apiClient } from '../utils/api';
import type { ApiResponse } from '../utils/api';

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// Auth Service
export class AuthService {
  // Login
  static async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  }

  // Register
  static async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/register', userData);
  }

  // Logout
  static async logout(): Promise<ApiResponse<null>> {
    return apiClient.post<null>('/auth/logout');
  }

  // Get current user profile
  static async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get<User>('/user/profile');
  }

  // Update user profile
  static async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>('/user/profile', userData);
  }

  // Refresh token
  static async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post<AuthResponse>('/auth/refresh');
  }
}
