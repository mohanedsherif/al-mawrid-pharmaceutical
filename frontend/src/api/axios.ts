import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { clearTokens, getTokens, setTokens } from './tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://al-mawrid-pharmaceutical-production.up.railway.app/api',
  withCredentials: true,
});

let isRefreshing = false;

api.interceptors.request.use((config) => {
  // Don't add Authorization header for auth endpoints (login, register, refresh)
  const isAuthEndpoint = config.url?.includes('/auth/login') || 
                         config.url?.includes('/auth/register') || 
                         config.url?.includes('/auth/refresh');
  
  if (!isAuthEndpoint) {
    const { accessToken } = getTokens();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    
    // Suppress console errors for connection refused (backend not running)
    const isConnectionError = error.code === 'ERR_NETWORK' || 
                              error.message === 'Network Error' ||
                              error.message?.includes('ERR_CONNECTION_REFUSED');
    
    if (isConnectionError) {
      // Silently handle - backend is likely not running
      // Don't spam console with connection errors
    } else {
      // Log other errors normally
      console.error('API Error:', error);
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${refreshed}`;
            return api(originalRequest);
          }
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  }
);

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken } = getTokens();
  if (!refreshToken) return null;

  try {
    const res = await axios.post(
      (import.meta.env.VITE_API_URL ?? 'https://al-mawrid-pharmaceutical-production.up.railway.app/api') + '/auth/refresh',
      { refreshToken },
      { withCredentials: true }
    );
    const accessToken = res.data?.accessToken as string | undefined;
    const newRefresh = res.data?.refreshToken as string | undefined;
    if (accessToken) {
      setTokens({ accessToken, refreshToken: newRefresh ?? refreshToken });
      return accessToken;
    }
    return null;
  } catch (e) {
    clearTokens();
    return null;
  }
};

export default api;

