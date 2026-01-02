import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { clearTokens, getTokens, setTokens } from '../api/tokenStorage';

type Role = 'USER' | 'ADMIN' | null;

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: Role;
  email: string | null;
}

const savedTokens = getTokens();

const initialState: AuthState = {
  accessToken: savedTokens.accessToken,
  refreshToken: savedTokens.refreshToken,
  role: null,
  email: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; email?: string; role?: Role }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.email ?? null;
      state.role = action.payload.role ?? state.role;
      setTokens({
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      });
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.email = null;
      clearTokens();
    },
  },
});

export const { setCredentials, logout, setRole } = authSlice.actions;
export default authSlice.reducer;

