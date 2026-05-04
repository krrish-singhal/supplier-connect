import 'dotenv/config';
import './src/config/firebase';
import { db } from './src/config/firebase';
import { v4 as uuid } from 'uuid';

const now = new Date().toISOString();

const suppliers = [
  // West (3)
  { id: uuid(), user_id: 'seed-user-1', name: 'ShriRam Packaging Co.', city: 'Mumbai', state: 'Maharashtra', region: 'West', category: 'Packaging', description: 'Premium HDPE packaging for FMCG brands', is_verified: true, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-2', name: 'Bharat Machinery Works', city: 'Pune', state: 'Maharashtra', region: 'West', category: 'Machinery', description: 'Industrial cutting and pressing machinery', is_verified: false, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-3', name: 'Agarwal Textiles', city: 'Ahmedabad', state: 'Gujarat', region: 'West', category: 'Textile', description: 'Cotton and synthetic fabric wholesaler', is_verified: false, logo_url: null, created_at: now },
  // North (3)
  { id: uuid(), user_id: 'seed-user-4', name: 'Delhi Electronics Hub', city: 'Delhi', state: 'Delhi', region: 'North', category: 'Electronics', description: 'Bulk electronic components supplier', is_verified: true, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-5', name: 'Noida Furniture World', city: 'Noida', state: 'Uttar Pradesh', region: 'North', category: 'Furniture', description: 'Office and commercial furniture manufacturer', is_verified: false, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-6', name: 'Jaipur Industrial Goods', city: 'Jaipur', state: 'Rajasthan', region: 'North', category: 'Industrial', description: 'MRO industrial supplies and hardware', is_verified: false, logo_url: null, created_at: now },
  // South (2)
  { id: uuid(), user_id: 'seed-user-7', name: 'Bangalore Chemicals Ltd', city: 'Bangalore', state: 'Karnataka', region: 'South', category: 'Chemicals', description: 'Industrial solvents and raw chemicals', is_verified: true, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-8', name: 'Chennai Logistics Pro', city: 'Chennai', state: 'Tamil Nadu', region: 'South', category: 'Logistics', description: 'Pan-India freight and warehousing', is_verified: false, logo_url: null, created_at: now },
  // East (2)
  { id: uuid(), user_id: 'seed-user-9', name: 'Kolkata Construction Co', city: 'Kolkata', state: 'West Bengal', region: 'East', category: 'Construction', description: 'Civil construction materials supplier', is_verified: false, logo_url: null, created_at: now },
  { id: uuid(), user_id: 'seed-user-10', name: 'Patna Office Supplies', city: 'Patna', state: 'Bihar', region: 'East', category: 'Office Supplies', description: 'Stationery and office equipment', is_verified: false, logo_url: null, created_at: now },
];

const opportunities = [
  { id: uuid(), title: 'New Township Construction Project', city: 'Pune', category: 'Construction', description: '500-unit residential township seeks civil material vendors', cta_label: 'Submit Proposal', created_at: now },
  { id: uuid(), title: 'Petrol Pump Dealership Opening', city: 'Delhi', category: 'Services', description: 'HP/BPCL dealership available for qualified partners', cta_label: 'Apply Now', created_at: now },
  { id: uuid(), title: 'Franchise Expansion Lead', city: 'Mumbai', category: 'Services', description: 'National food chain expanding — franchise partners needed', cta_label: 'Show Interest', created_at: now },
  { id: uuid(), title: 'Government Tender Alert', city: 'Bangalore', category: 'Industrial', description: 'State PWD open tender for road construction materials', cta_label: 'View Tender', created_at: now },
  { id: uuid(), title: 'Warehouse Development Project', city: 'Ahmedabad', category: 'Logistics', description: '3PL warehousing partner needed for e-commerce brand', cta_label: 'Contact Us', created_at: now },
];

async function seed() {
  console.log('Seeding suppliers...');
  for (const supplier of suppliers) {
    await db.collection('suppliers').doc(supplier.id).set(supplier);
    console.log(`  ✓ ${supplier.name}`);
  }

  console.log('\nSeeding opportunities...');
  for (const opp of opportunities) {
    await db.collection('opportunities').doc(opp.id).set(opp);
    console.log(`  ✓ ${opp.title}`);
  }

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
