import apiClient from '../lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: {
      email: string;
    };
  };
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      throw error as ApiError;
    }
  }
}

export default new AuthService();
