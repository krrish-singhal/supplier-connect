import { create } from 'zustand';
import { User, AuthState } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore extends AuthState {
  token: string | null;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  phoneNumber: '',
  token: null,

  setPhoneNumber: (phone: string) => set({ phoneNumber: phone }),

  setToken: (token: string | null) => {
    set({ token });
    if (token) {
      AsyncStorage.setItem('auth_token', token);
    } else {
      AsyncStorage.removeItem('auth_token');
    }
  },

  setUser: (user: User | null, token?: string) => {
    const tok = token ?? get().token;
    set({ user, isAuthenticated: !!user, isLoading: false, token: tok ?? null });
    if (user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('user');
    }
    if (tok) {
      AsyncStorage.setItem('auth_token', tok);
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  logout: () => {
    set({ user: null, isAuthenticated: false, phoneNumber: '', token: null });
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('auth_token');
  },

  hydrate: async () => {
    try {
      const [storedUser, storedToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('auth_token'),
      ]);
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        set({ user, isAuthenticated: true, isLoading: false, token: storedToken });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to hydrate auth state:', error);
      set({ isLoading: false });
    }
  },
}));
