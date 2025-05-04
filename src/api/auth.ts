import { api } from './config';

interface RegisterData {
  email: string;
  password: string;
  password2: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  email: string;
  tokens: {
    refresh: string;
    access: string;
  };
}

interface LogoutResponse {
  message: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', data);
    localStorage.setItem('accessToken', response.data.tokens.access);
    localStorage.setItem('refreshToken', response.data.tokens.refresh);
    return response.data;
  },

  login: async (data: LoginData): Promise<{ refresh: string; access: string }> => {
    const response = await api.post<{ refresh: string; access: string }>('/auth/login/', data);
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  },

  passwordResetRequest: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/password-reset/request/', { email });
    return response.data;
  },

  passwordResetVerify: async (email: string, code: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/password-reset/verify/', { email, code });
    return response.data;
  },

  passwordResetReset: async (data: { email: string; code: string; password: string; password2: string }): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/password-reset/reset/', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    localStorage.setItem('accessToken', response.data.access);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return Promise.resolve({ message: 'No refresh token, local logout only' });
    }

    const response = await api.post<LogoutResponse>('/auth/logout/', {
      refresh: refreshToken,
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  googleAuth: async (code: string): Promise<{ refresh: string; access: string }> => {
    const response = await api.post<{ refresh: string; access: string }>('/auth/google/', { code });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  },
}; 