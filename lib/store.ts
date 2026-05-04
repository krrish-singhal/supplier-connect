import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Region, Supplier } from './types';

// Auth Store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phone: string;
  setPhone: (phone: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      phone: '',
      setPhone: (phone) => set({ phone }),
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false, phone: '' }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Onboarding Store
interface OnboardingStore {
  step: number;
  name: string;
  companyName: string;
  role: 'buyer' | 'supplier' | null;
  city: string;
  categories: string[];
  setStep: (step: number) => void;
  setName: (name: string) => void;
  setCompanyName: (companyName: string) => void;
  setRole: (role: 'buyer' | 'supplier') => void;
  setCity: (city: string) => void;
  setCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  step: 1,
  name: '',
  companyName: '',
  role: null,
  city: '',
  categories: [],
  setStep: (step) => set({ step }),
  setName: (name) => set({ name }),
  setCompanyName: (companyName) => set({ companyName }),
  setRole: (role) => set({ role }),
  setCity: (city) => set({ city }),
  setCategories: (categories) => set({ categories }),
  toggleCategory: (category) =>
    set((state) => ({
      categories: state.categories.includes(category)
        ? state.categories.filter((c) => c !== category)
        : [...state.categories, category],
    })),
  reset: () =>
    set({
      step: 1,
      name: '',
      companyName: '',
      role: null,
      city: '',
      categories: [],
    }),
}));

// App Store
interface AppStore {
  selectedRegion: Region;
  searchQuery: string;
  savedSuppliers: string[];
  setSelectedRegion: (region: Region) => void;
  setSearchQuery: (query: string) => void;
  toggleSavedSupplier: (supplierId: string) => void;
  isSaved: (supplierId: string) => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      selectedRegion: 'west',
      searchQuery: '',
      savedSuppliers: [],
      setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      toggleSavedSupplier: (supplierId) =>
        set((state) => ({
          savedSuppliers: state.savedSuppliers.includes(supplierId)
            ? state.savedSuppliers.filter((id) => id !== supplierId)
            : [...state.savedSuppliers, supplierId],
        })),
      isSaved: (supplierId) => get().savedSuppliers.includes(supplierId),
    }),
    {
      name: 'app-storage',
    }
  )
);
