import { db } from "../config/firebase";

const REGION_MAP: Record<string, string[]> = {
  North: [
    "Delhi",
    "Noida",
    "Ludhiana",
    "Chandigarh",
    "Jaipur",
    "Amritsar",
    "Agra",
  ],
  South: ["Bangalore", "Chennai", "Hyderabad", "Kochi", "Coimbatore", "Mysore"],
  West: ["Mumbai", "Pune", "Ahmedabad", "Surat", "Goa", "Nashik", "Rajkot"],
  East: ["Kolkata", "Patna", "Bhubaneswar", "Guwahati", "Ranchi"],
};

export const deriveRegion = (city: string): string => {
  for (const [region, cities] of Object.entries(REGION_MAP)) {
    if (cities.some((c) => c.toLowerCase() === city.toLowerCase()))
      return region;
  }
  return "North";
};

export const getRegionCities = (region: string): string[] => {
  return REGION_MAP[region] || [];
};

interface SupplierFilters {
  region?: string;
  category?: string;
  city?: string;
  is_verified?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export const getSuppliers = async (filters: SupplierFilters) => {
  const {
    region,
    category,
    city,
    is_verified,
    search,
    limit = 20,
    offset = 0,
  } = filters;

  let query: FirebaseFirestore.Query = db.collection("suppliers");

  if (region) query = query.where("region", "==", region);
  if (category) query = query.where("category", "==", category);
  if (is_verified === "true") query = query.where("is_verified", "==", true);

  const snapshot = await query.get();
  let suppliers = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Record<string, any>[];

  // In-memory filters for case-insensitive or search
  if (city) {
    const q = city.toLowerCase();
    suppliers = suppliers.filter((s) =>
      (s.city as string).toLowerCase().includes(q),
    );
  }
  if (search) {
    const q = search.toLowerCase();
    suppliers = suppliers.filter(
      (s) =>
        (s.name as string).toLowerCase().includes(q) ||
        (s.description as string).toLowerCase().includes(q),
    );
  }

  const total = suppliers.length;
  const paginated = suppliers.slice(offset, offset + limit);
  return { suppliers: paginated, total };
};
