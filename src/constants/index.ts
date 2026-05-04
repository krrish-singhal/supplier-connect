import { Region, Category } from "@/src/types";

/**
 * DEMO_MODE = true  →  auth bypass always on, OTP is always 123456.
 * Set to false before connecting to a real backend.
 */
export const DEMO_MODE = true;

export const REGIONS: Region[] = [
  "North India",
  "South India",
  "East India",
  "West India",
  "Central India",
  "Northeast India",
];

/** Maps each region to its major cities for filtering purposes */
export const REGION_CITIES: Record<Region, string[]> = {
  "North India": [
    "Delhi",
    "Noida",
    "Gurgaon",
    "Jaipur",
    "Lucknow",
    "Agra",
    "Chandigarh",
    "Amritsar",
  ],
  "South India": [
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kochi",
    "Mysore",
    "Coimbatore",
    "Visakhapatnam",
  ],
  "East India": ["Kolkata", "Bhubaneswar", "Patna", "Ranchi", "Guwahati"],
  "West India": ["Mumbai", "Pune", "Ahmedabad", "Surat", "Vadodara", "Nagpur"],
  "Central India": ["Indore", "Bhopal", "Raipur", "Jabalpur", "Gwalior"],
  "Northeast India": ["Guwahati", "Shillong", "Imphal", "Agartala", "Aizawl"],
};

export const CATEGORIES: Category[] = [
  "Raw Materials",
  "Packaging",
  "Electronics",
  "Textiles",
  "Machinery",
  "Chemicals",
  "Food & Beverages",
  "Construction",
  "Agriculture",
  "Automotive",
];

export const COLORS = {
  primary: "#2563EB",
  primaryLight: "#DBEAFE",
  secondary: "#64748B",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  background: "#F8FAFC",
  white: "#FFFFFF",
  black: "#0F172A",
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
};

export const FONTS = {
  regular: "Inter-Regular",
  medium: "Inter-Medium",
  semiBold: "Inter-SemiBold",
  bold: "Inter-Bold",
};
