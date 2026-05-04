// User types
export interface User {
  id: string;
  phone: string;
  name: string;
  companyName: string;
  role: 'buyer' | 'supplier';
  city: string;
  categories: string[];
  isVerified: boolean;
  createdAt: string;
}

// Supplier types
export interface Supplier {
  id: string;
  companyName: string;
  logo?: string;
  city: string;
  region: Region;
  category: string;
  categories: string[];
  description: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  products: Product[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  establishedYear?: number;
  employeeCount?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  price?: string;
  minOrder?: string;
}

// Opportunity types
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  city: string;
  region: Region;
  category: string;
  budget?: string;
  deadline?: string;
  postedBy: string;
  postedAt: string;
  status: 'open' | 'closed';
}

// Inquiry types
export interface Inquiry {
  id: string;
  supplierId: string;
  userId: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'closed';
}

// Region type
export type Region = 'north' | 'south' | 'east' | 'west';

// Category type
export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Onboarding state
export interface OnboardingState {
  step: number;
  name: string;
  companyName: string;
  role: 'buyer' | 'supplier' | null;
  city: string;
  categories: string[];
}
