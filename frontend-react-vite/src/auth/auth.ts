import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const getTokenPayload = (token: string): JWTPayload | null => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  return !isTokenExpired(token);
};

export const getUserRole = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const payload = getTokenPayload(token);
  return payload?.role || null;
};

export const getUserId = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  
  const payload = getTokenPayload(token);
  return payload?.userId || null;
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const setAuthData = (accessToken: string, refreshToken: string, user: any): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getStoredUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};