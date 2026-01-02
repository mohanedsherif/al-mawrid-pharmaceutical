// Utility to decode JWT token and extract claims
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export const extractRoleFromToken = (token: string): 'USER' | 'ADMIN' | null => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Check for role in authorities or role claim
  if (decoded.authorities) {
    const authorities = Array.isArray(decoded.authorities) ? decoded.authorities : [decoded.authorities];
    const adminAuthority = authorities.find((auth: string) => auth.includes('ADMIN') || auth === 'ROLE_ADMIN');
    if (adminAuthority) return 'ADMIN';
  }
  
  if (decoded.role) {
    return decoded.role === 'ADMIN' ? 'ADMIN' : 'USER';
  }
  
  // Fallback: check if any claim contains ADMIN
  const claims = JSON.stringify(decoded);
  if (claims.includes('ADMIN') || claims.includes('ROLE_ADMIN')) {
    return 'ADMIN';
  }
  
  return 'USER';
};

