import { create } from 'zustand';
import { Region, Category, SupplierFilters, OpportunityFilters, OpportunityStatus } from '@/src/types';

interface FiltersStore {
  supplierFilters: SupplierFilters;
  opportunityFilters: OpportunityFilters;
  setSupplierSearch: (search: string) => void;
  setSupplierRegion: (region: Region | 'all') => void;
  setSupplierCategories: (categories: Category[]) => void;
  setSupplierSortBy: (sortBy: 'rating' | 'name' | 'recent') => void;
  setSupplierMinRating: (rating: number) => void;
  resetSupplierFilters: () => void;
  setOpportunitySearch: (search: string) => void;
  setOpportunityStatus: (status: OpportunityStatus | 'all') => void;
  setOpportunityCategories: (categories: Category[]) => void;
  setOpportunityRegion: (region: Region | 'all') => void;
  resetOpportunityFilters: () => void;
}

const defaultSupplierFilters: SupplierFilters = {
  search: '',
  region: 'all',
  categories: [],
  sortBy: 'rating',
  minRating: 0,
};

const defaultOpportunityFilters: OpportunityFilters = {
  search: '',
  status: 'all',
  categories: [],
  region: 'all',
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  supplierFilters: defaultSupplierFilters,
  opportunityFilters: defaultOpportunityFilters,

  setSupplierSearch: (search) =>
    set((state) => ({
      supplierFilters: { ...state.supplierFilters, search },
    })),

  setSupplierRegion: (region) =>
    set((state) => ({
      supplierFilters: { ...state.supplierFilters, region },
    })),

  setSupplierCategories: (categories) =>
    set((state) => ({
      supplierFilters: { ...state.supplierFilters, categories },
    })),

  setSupplierSortBy: (sortBy) =>
    set((state) => ({
      supplierFilters: { ...state.supplierFilters, sortBy },
    })),

  setSupplierMinRating: (minRating) =>
    set((state) => ({
      supplierFilters: { ...state.supplierFilters, minRating },
    })),

  resetSupplierFilters: () =>
    set({ supplierFilters: defaultSupplierFilters }),

  setOpportunitySearch: (search) =>
    set((state) => ({
      opportunityFilters: { ...state.opportunityFilters, search },
    })),

  setOpportunityStatus: (status) =>
    set((state) => ({
      opportunityFilters: { ...state.opportunityFilters, status },
    })),

  setOpportunityCategories: (categories) =>
    set((state) => ({
      opportunityFilters: { ...state.opportunityFilters, categories },
    })),

  setOpportunityRegion: (region) =>
    set((state) => ({
      opportunityFilters: { ...state.opportunityFilters, region },
    })),

  resetOpportunityFilters: () =>
    set({ opportunityFilters: defaultOpportunityFilters }),
}));
