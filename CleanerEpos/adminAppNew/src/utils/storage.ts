import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './constants';
import { ApplicationUserModel } from '@/types/models';

export const storage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getUser(): ApplicationUserModel | null {
    const userStr = localStorage.getItem(AUTH_USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  setUser(user: ApplicationUserModel): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  },
};
