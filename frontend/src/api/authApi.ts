import api from './axios';
import { setTokens } from './tokenStorage';

export type AuthPayload = {
  email: string;
  password: string;
};

export interface UserInfo {
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
}

export const register = async (data: { fullName: string } & AuthPayload) => {
  const res = await api.post('/auth/register', data);
  setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
  return res.data;
};

export const login = async (data: AuthPayload) => {
  const res = await api.post('/auth/login', data);
  setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken });
  return res.data;
};

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    setTokens({ accessToken: null, refreshToken: null });
  }
};
