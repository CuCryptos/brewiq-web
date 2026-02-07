import { api, setTokens, clearTokens } from "./client";
import type { User, LoginResponse, AuthTokens } from "@/lib/types";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  password: string;
}

// API wraps responses in { success: boolean, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  async login(params: LoginParams): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<AuthData>>("/auth/login", params);
    const { accessToken, refreshToken, user } = response.data.data;
    setTokens(accessToken, refreshToken);
    return {
      user,
      tokens: { accessToken, refreshToken },
    };
  },

  async register(params: RegisterParams): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<AuthData>>("/auth/register", params);
    const { accessToken, refreshToken, user } = response.data.data;
    setTokens(accessToken, refreshToken);
    return {
      user,
      tokens: { accessToken, refreshToken },
    };
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      clearTokens();
    }
  },

  async forgotPassword(params: ForgotPasswordParams): Promise<{ message: string }> {
    const response = await api.post("/auth/forgot-password", params);
    return response.data;
  },

  async resetPassword(params: ResetPasswordParams): Promise<{ message: string }> {
    const response = await api.post("/auth/reset-password", params);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data.data;
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    setTokens(accessToken, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  },

  // OAuth URLs
  getGoogleAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?provider=google`;
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile`;
  },

  getGithubAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?provider=github`;
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
  },

  async handleOAuthCallback(_provider: string, code: string): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<AuthData>>("/auth/oauth/exchange", { code });
    const { accessToken, refreshToken, user } = response.data.data;
    setTokens(accessToken, refreshToken);
    return {
      user,
      tokens: { accessToken, refreshToken },
    };
  },
};
