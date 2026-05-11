import { UserRole } from '@/types';

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
  redirect: string;
}

const SESSION_KEY = 'authUser';

export const saveUserSession = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getUserSession = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const clearUserSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = () => !!getUserSession();
