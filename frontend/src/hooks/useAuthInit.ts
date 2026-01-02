import { useEffect } from 'react';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { getCurrentUser } from '../api/authApi';
import { setCredentials, setRole, logout } from '../store/authSlice';
import { extractRoleFromToken } from '../utils/jwt';
import { getTokens } from '../api/tokenStorage';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const { accessToken, role } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      const tokens = getTokens();
      
      // If we have a token but no role, try to extract it
      if (tokens.accessToken && !role) {
        // First try to extract from token
        const tokenRole = extractRoleFromToken(tokens.accessToken);
        
        if (tokenRole) {
          dispatch(setRole(tokenRole));
        } else {
          // Fallback: fetch from API
          try {
            const userInfo = await getCurrentUser();
            
            if (userInfo) {
              dispatch(setCredentials({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken || '',
                email: userInfo.email,
                role: userInfo.role,
              }));
            } else {
              // If user info fetch fails, clear invalid tokens
              dispatch(logout());
            }
          } catch (error) {
            console.error('Failed to initialize auth:', error);
            // Clear invalid tokens if API call fails
            dispatch(logout());
          }
        }
      } else if (!tokens.accessToken && accessToken) {
        // If tokens are cleared but state still has token, clear state
        dispatch(logout());
      }
    };

    // Only run once on mount
    if (!accessToken || !role) {
      initializeAuth();
    }
  }, []); // Empty dependency array - only run on mount
};

