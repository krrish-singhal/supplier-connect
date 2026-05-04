// Region Types
export type Region =
  | "North India"
  | "South India"
  | "East India"
  | "West India"
  | "Central India"
  | "Northeast India";

// Category Types
export type Category =
  | "Raw Materials"
  | "Packaging"
  | "Electronics"
  | "Textiles"
  | "Machinery"
  | "Chemicals"
  | "Food & Beverages"
  | "Construction"
  | "Agriculture"
  | "Automotive";

// User Types
export interface User {
  id: string;
  phone: string;
  name: string;
  businessName: string;
  email?: string;
  region: Region;
  categories: Category[];
  avatar?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  businessName: string;
  description: string;
  phone: string;
  email: string;
  website?: string;
  region: Region;
  city: string;
  categories: Category[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  yearsInBusiness: number;
  minimumOrderValue: number;
  avatar?: string;
  images: string[];
  createdAt: Date;
}

// Opportunity Types
export type OpportunityStatus = "open" | "in-progress" | "closed";

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: Category;
  region: Region;
  budget: {
    min: number;
    max: number;
  };
  quantity: string;
  deadline: Date;
  status: OpportunityStatus;
  requirements: string[];
  postedBy: {
    id: string;
    name: string;
    businessName: string;
    isVerified: boolean;
  };
  applicantsCount: number;
  createdAt: Date;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  setUser: (user: User | null, token?: string) => void;
  logout: () => void;
}

// Filter Types
export interface SupplierFilters {
  search: string;
  region: Region | "all";
  categories: Category[];
  sortBy: "rating" | "name" | "recent";
  minRating: number;
}

export interface OpportunityFilters {
  search: string;
  status: OpportunityStatus | "all";
  categories: Category[];
  region: Region | "all";
}
