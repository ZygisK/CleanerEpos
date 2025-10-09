import { create } from 'zustand';
import { ApplicationUserModel } from '@/types/models';
import { storage } from '@/utils/storage';

interface AuthState {
  user: ApplicationUserModel | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setAuth: (user: ApplicationUserModel, token: string) => void;
  clearAuth: () => void;
  setUser: (user: ApplicationUserModel) => void;
  initAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    storage.setToken(token);
    storage.setUser(user);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearAuth: () => {
    storage.clearAuth();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setUser: (user) => {
    storage.setUser(user);
    set({ user });
  },

  initAuth: () => {
    const token = storage.getToken();
    const user = storage.getUser();

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
}));
