export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const getTokens = (): Tokens => ({
  accessToken: localStorage.getItem(ACCESS_KEY),
  refreshToken: localStorage.getItem(REFRESH_KEY),
});

export const setTokens = ({ accessToken, refreshToken }: Tokens) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};



