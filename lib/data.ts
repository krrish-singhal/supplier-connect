import type { Supplier, Opportunity, Category, Region } from './types';

// Region to cities mapping
export const regionCities: Record<Region, string[]> = {
  west: ['Mumbai', 'Pune', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Nashik'],
  north: ['Delhi', 'Noida', 'Gurgaon', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kanpur'],
  south: ['Bangalore', 'Chennai', 'Hyderabad', 'Kochi', 'Coimbatore', 'Visakhapatnam'],
  east: ['Kolkata', 'Bhubaneswar', 'Patna', 'Ranchi', 'Guwahati', 'Siliguri'],
};

// Categories
export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'Cpu', count: 156 },
  { id: '2', name: 'Textiles', icon: 'Shirt', count: 234 },
  { id: '3', name: 'Machinery', icon: 'Cog', count: 89 },
  { id: '4', name: 'Chemicals', icon: 'FlaskConical', count: 67 },
  { id: '5', name: 'Food & Beverages', icon: 'Coffee', count: 198 },
  { id: '6', name: 'Construction', icon: 'Building2', count: 112 },
  { id: '7', name: 'Automotive', icon: 'Car', count: 78 },
  { id: '8', name: 'Packaging', icon: 'Package', count: 145 },
  { id: '9', name: 'Pharmaceuticals', icon: 'Pill', count: 56 },
  { id: '10', name: 'Agriculture', icon: 'Wheat', count: 167 },
];

// Mock suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'TechVision Electronics',
    city: 'Mumbai',
    region: 'west',
    category: 'Electronics',
    categories: ['Electronics', 'Machinery'],
    description: 'Leading manufacturer of industrial electronic components and automation systems with 15+ years of experience.',
    isVerified: true,
    rating: 4.8,
    reviewCount: 124,
    establishedYear: 2008,
    employeeCount: '100-500',
    products: [
      { id: 'p1', name: 'Industrial PLC Controller', description: 'High-performance programmable logic controller', price: '₹45,000', minOrder: '10 units' },
      { id: 'p2', name: 'Servo Motor Drive', description: 'Precision servo motor drive system', price: '₹28,000', minOrder: '5 units' },
      { id: 'p3', name: 'Touch Panel HMI', description: '10-inch industrial touch panel', price: '₹35,000', minOrder: '3 units' },
    ],
  },
  {
    id: '2',
    companyName: 'Sharma Textiles Pvt Ltd',
    city: 'Surat',
    region: 'west',
    category: 'Textiles',
    categories: ['Textiles'],
    description: 'Premium quality fabric manufacturer specializing in silk and cotton blends for fashion and home textiles.',
    isVerified: true,
    rating: 4.6,
    reviewCount: 89,
    establishedYear: 1995,
    employeeCount: '500-1000',
    products: [
      { id: 'p4', name: 'Pure Silk Fabric', description: 'Premium mulberry silk fabric', price: '₹1,200/meter', minOrder: '100 meters' },
      { id: 'p5', name: 'Cotton Blend', description: 'Cotton-polyester blend fabric', price: '₹350/meter', minOrder: '200 meters' },
    ],
  },
  {
    id: '3',
    companyName: 'Delhi Industrial Solutions',
    city: 'Delhi',
    region: 'north',
    category: 'Machinery',
    categories: ['Machinery', 'Automotive'],
    description: 'Industrial machinery supplier providing CNC machines, lathes, and precision engineering equipment.',
    isVerified: true,
    rating: 4.7,
    reviewCount: 156,
    establishedYear: 2002,
    employeeCount: '50-100',
    products: [
      { id: 'p6', name: 'CNC Milling Machine', description: '3-axis CNC milling center', price: '₹12,00,000', minOrder: '1 unit' },
      { id: 'p7', name: 'Precision Lathe', description: 'High-precision turning lathe', price: '₹8,50,000', minOrder: '1 unit' },
    ],
  },
  {
    id: '4',
    companyName: 'Southern Spices Co.',
    city: 'Chennai',
    region: 'south',
    category: 'Food & Beverages',
    categories: ['Food & Beverages', 'Agriculture'],
    description: 'Exporter of premium Indian spices and food ingredients with international quality certifications.',
    isVerified: true,
    rating: 4.9,
    reviewCount: 203,
    establishedYear: 1988,
    employeeCount: '100-500',
    products: [
      { id: 'p8', name: 'Premium Cardamom', description: 'Grade A green cardamom', price: '₹2,500/kg', minOrder: '50 kg' },
      { id: 'p9', name: 'Black Pepper', description: 'Malabar black pepper', price: '₹800/kg', minOrder: '100 kg' },
    ],
  },
  {
    id: '5',
    companyName: 'Bengal Packaging Industries',
    city: 'Kolkata',
    region: 'east',
    category: 'Packaging',
    categories: ['Packaging'],
    description: 'Complete packaging solutions including corrugated boxes, flexible packaging, and custom designs.',
    isVerified: false,
    rating: 4.3,
    reviewCount: 67,
    establishedYear: 2010,
    employeeCount: '50-100',
    products: [
      { id: 'p10', name: 'Corrugated Boxes', description: 'Custom corrugated shipping boxes', price: '₹25/piece', minOrder: '500 pieces' },
      { id: 'p11', name: 'Flexible Pouches', description: 'Printed laminated pouches', price: '₹8/piece', minOrder: '1000 pieces' },
    ],
  },
  {
    id: '6',
    companyName: 'Rajasthan Chemicals Ltd',
    city: 'Jaipur',
    region: 'north',
    category: 'Chemicals',
    categories: ['Chemicals'],
    description: 'Industrial chemical manufacturer specializing in dyes, pigments, and specialty chemicals.',
    isVerified: true,
    rating: 4.5,
    reviewCount: 92,
    establishedYear: 2005,
    employeeCount: '100-500',
    products: [
      { id: 'p12', name: 'Reactive Dyes', description: 'Textile reactive dyes', price: '₹450/kg', minOrder: '25 kg' },
      { id: 'p13', name: 'Industrial Pigments', description: 'Color pigments for paints', price: '₹320/kg', minOrder: '50 kg' },
    ],
  },
  {
    id: '7',
    companyName: 'Hyderabad Pharma Solutions',
    city: 'Hyderabad',
    region: 'south',
    category: 'Pharmaceuticals',
    categories: ['Pharmaceuticals', 'Chemicals'],
    description: 'Pharmaceutical intermediates and API manufacturer with WHO-GMP certification.',
    isVerified: true,
    rating: 4.8,
    reviewCount: 178,
    establishedYear: 2000,
    employeeCount: '500-1000',
    products: [
      { id: 'p14', name: 'Paracetamol API', description: 'Pharmaceutical grade paracetamol', price: 'Contact for quote', minOrder: '500 kg' },
      { id: 'p15', name: 'Metformin API', description: 'High purity metformin HCl', price: 'Contact for quote', minOrder: '250 kg' },
    ],
  },
  {
    id: '8',
    companyName: 'Pune Auto Components',
    city: 'Pune',
    region: 'west',
    category: 'Automotive',
    categories: ['Automotive', 'Machinery'],
    description: 'OEM supplier of precision automotive components including gears, shafts, and engine parts.',
    isVerified: true,
    rating: 4.6,
    reviewCount: 134,
    establishedYear: 1998,
    employeeCount: '100-500',
    products: [
      { id: 'p16', name: 'Transmission Gears', description: 'Precision cut gears for gearbox', price: '₹850/piece', minOrder: '100 pieces' },
      { id: 'p17', name: 'Drive Shafts', description: 'Hardened steel drive shafts', price: '₹1,200/piece', minOrder: '50 pieces' },
    ],
  },
  {
    id: '9',
    companyName: 'Bangalore Tech Materials',
    city: 'Bangalore',
    region: 'south',
    category: 'Electronics',
    categories: ['Electronics'],
    description: 'Semiconductor and electronic component distributor with pan-India presence.',
    isVerified: true,
    rating: 4.7,
    reviewCount: 212,
    establishedYear: 2012,
    employeeCount: '50-100',
    products: [
      { id: 'p18', name: 'Microcontrollers', description: 'ARM-based microcontrollers', price: '₹180/piece', minOrder: '500 pieces' },
      { id: 'p19', name: 'Power MOSFETs', description: 'High-power switching transistors', price: '₹45/piece', minOrder: '1000 pieces' },
    ],
  },
  {
    id: '10',
    companyName: 'Odisha Agro Industries',
    city: 'Bhubaneswar',
    region: 'east',
    category: 'Agriculture',
    categories: ['Agriculture', 'Food & Beverages'],
    description: 'Agricultural produce processor and exporter specializing in rice, pulses, and oilseeds.',
    isVerified: false,
    rating: 4.2,
    reviewCount: 56,
    establishedYear: 2015,
    employeeCount: '50-100',
    products: [
      { id: 'p20', name: 'Basmati Rice', description: 'Premium aged basmati rice', price: '₹120/kg', minOrder: '500 kg' },
      { id: 'p21', name: 'Yellow Lentils', description: 'Cleaned and sorted toor dal', price: '₹95/kg', minOrder: '250 kg' },
    ],
  },
  {
    id: '11',
    companyName: 'Gujarat Construction Materials',
    city: 'Ahmedabad',
    region: 'west',
    category: 'Construction',
    categories: ['Construction'],
    description: 'Building materials supplier including cement, steel, and construction chemicals.',
    isVerified: true,
    rating: 4.4,
    reviewCount: 88,
    establishedYear: 2007,
    employeeCount: '100-500',
    products: [
      { id: 'p22', name: 'Portland Cement', description: 'OPC 53 grade cement', price: '₹380/bag', minOrder: '100 bags' },
      { id: 'p23', name: 'TMT Steel Bars', description: 'Fe 500D TMT rebars', price: '₹65,000/ton', minOrder: '5 tons' },
    ],
  },
  {
    id: '12',
    companyName: 'Kerala Coir Products',
    city: 'Kochi',
    region: 'south',
    category: 'Agriculture',
    categories: ['Agriculture', 'Packaging'],
    description: 'Manufacturer of coir products including mats, ropes, and growing media for horticulture.',
    isVerified: true,
    rating: 4.5,
    reviewCount: 73,
    establishedYear: 1992,
    employeeCount: '100-500',
    products: [
      { id: 'p24', name: 'Coir Pith Blocks', description: 'Compressed coco peat blocks', price: '₹15/block', minOrder: '1000 blocks' },
      { id: 'p25', name: 'Coir Mats', description: 'Natural coir door mats', price: '₹250/piece', minOrder: '100 pieces' },
    ],
  },
];

// Mock opportunities
export const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Bulk Order: Electronic Components',
    description: 'Looking for suppliers of industrial PLCs and automation components for manufacturing plant upgrade.',
    city: 'Pune',
    region: 'west',
    category: 'Electronics',
    budget: '₹50-75 Lakhs',
    deadline: '2024-03-15',
    postedBy: 'Mahindra Engineering',
    postedAt: '2024-01-20',
    status: 'open',
  },
  {
    id: '2',
    title: 'Textile Raw Materials Required',
    description: 'Seeking cotton and silk fabric suppliers for new fashion line. Quality certification required.',
    city: 'Mumbai',
    region: 'west',
    category: 'Textiles',
    budget: '₹25-40 Lakhs',
    deadline: '2024-02-28',
    postedBy: 'Fashion Forward Ltd',
    postedAt: '2024-01-18',
    status: 'open',
  },
  {
    id: '3',
    title: 'Packaging Solutions Tender',
    description: 'Annual contract for corrugated boxes and flexible packaging for FMCG products.',
    city: 'Delhi',
    region: 'north',
    category: 'Packaging',
    budget: '₹1-2 Crores',
    deadline: '2024-04-01',
    postedBy: 'Consumer Goods India',
    postedAt: '2024-01-22',
    status: 'open',
  },
  {
    id: '4',
    title: 'Spices Export Partnership',
    description: 'International buyer seeking direct partnerships with Indian spice exporters for European market.',
    city: 'Chennai',
    region: 'south',
    category: 'Food & Beverages',
    budget: 'Negotiable',
    deadline: '2024-03-30',
    postedBy: 'EuroSpice GmbH',
    postedAt: '2024-01-19',
    status: 'open',
  },
  {
    id: '5',
    title: 'CNC Machinery Procurement',
    description: 'Government tender for CNC machines and precision equipment for ITI workshops.',
    city: 'Bangalore',
    region: 'south',
    category: 'Machinery',
    budget: '₹2-3 Crores',
    deadline: '2024-05-15',
    postedBy: 'Directorate of Technical Education',
    postedAt: '2024-01-21',
    status: 'open',
  },
  {
    id: '6',
    title: 'Pharmaceutical Raw Materials',
    description: 'Looking for API suppliers with WHO-GMP certification for tablet manufacturing.',
    city: 'Hyderabad',
    region: 'south',
    category: 'Pharmaceuticals',
    budget: '₹80 Lakhs - 1 Crore',
    deadline: '2024-03-20',
    postedBy: 'MedLife Pharma',
    postedAt: '2024-01-23',
    status: 'open',
  },
  {
    id: '7',
    title: 'Construction Materials Supply',
    description: 'Long-term supplier needed for cement, steel, and construction chemicals for housing project.',
    city: 'Kolkata',
    region: 'east',
    category: 'Construction',
    budget: '₹5-8 Crores',
    deadline: '2024-06-01',
    postedBy: 'Urban Housing Corp',
    postedAt: '2024-01-24',
    status: 'open',
  },
  {
    id: '8',
    title: 'Auto Parts Manufacturing Contract',
    description: 'OEM contract for transmission components. ISO/TS 16949 certification mandatory.',
    city: 'Gurgaon',
    region: 'north',
    category: 'Automotive',
    budget: '₹3-5 Crores',
    deadline: '2024-04-30',
    postedBy: 'Maruti Suppliers Division',
    postedAt: '2024-01-25',
    status: 'open',
  },
];

// Helper functions
export function getSuppliersByRegion(region: Region): Supplier[] {
  return suppliers.filter(s => s.region === region);
}

export function getSuppliersByCategory(category: string): Supplier[] {
  return suppliers.filter(s => s.categories.includes(category));
}

export function getSuppliersByCity(city: string): Supplier[] {
  return suppliers.filter(s => s.city === city);
}

export function searchSuppliers(query: string): Supplier[] {
  const lowerQuery = query.toLowerCase();
  return suppliers.filter(
    s =>
      s.companyName.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.city.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
  );
}

export function getOpportunitiesByRegion(region: Region): Opportunity[] {
  return opportunities.filter(o => o.region === region);
}

export function getFeaturedSuppliers(): Supplier[] {
  return suppliers.filter(s => s.isVerified && s.rating >= 4.5).slice(0, 6);
}

export function getTrendingCategories(): Category[] {
  return categories.slice(0, 6);
}
