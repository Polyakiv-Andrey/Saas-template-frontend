import { api } from './config';

interface RegisterData {
  email: string;
  password: string;
  password2: string;
}
interface ChangePasswordData {
  old_password: string;
  new_password: string;
  new_password2: string;
}
interface CurrentUser {
  id: number;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
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
    localStorage.setItem('access_token', response.data.tokens.access);
    localStorage.setItem('refresh_token', response.data.tokens.refresh);
    return response.data;
  },

  login: async (data: LoginData): Promise<{ refresh: string; access: string }> => {
    const response = await api.post<{ refresh: string; access: string }>('/auth/login/', data);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
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

  refresh_token: async (refresh_token: string): Promise<{ access: string }> => {
    const response = await api.post<{ access: string }>('/auth/token/refresh/', {
      refresh: refresh_token,
    });
    localStorage.setItem('access_token', response.data.access);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (!refresh_token) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return Promise.resolve({ message: 'No refresh token, local logout only' });
    }

    const response = await api.post<LogoutResponse>('/auth/logout/', {
      refresh: refresh_token,
    });

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  googleAuth: async (code: string): Promise<{ refresh: string; access: string }> => {
    const response = await api.post<{ refresh: string; access: string }>('/auth/google/', { code });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return response.data;
  },
  getCurrentUser: async (): Promise<CurrentUser> => {
    const { data } = await api.get<CurrentUser>('/auth/users/me/');
    return data;
  },
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>('/auth/password/change/', data);
    return response.data;
  }
}; 