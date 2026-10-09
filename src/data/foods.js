/**
 * REPLATE Food Types Dataset
 * Factual reference data for common surplus food streams.
 * Includes perishability windows, default distribution ease, and standard density/serving factors.
 * Reference: FAO Food Loss & Waste Protocols, USDA Serving Size Guidelines.
 */

export const FOOD_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'prepared', name: 'Prepared Food & Meals' },
  { id: 'bakery', name: 'Bakery & Grains' },
  { id: 'produce', name: 'Fresh Produce' },
  { id: 'packaged', name: 'Packaged & Ambient' },
  { id: 'dairy', name: 'Dairy & Chilled' }
];

export const FOOD_TYPES = [
  {
    id: 'cooked-rice',
    name: 'Cooked Rice',
    category: 'prepared',
    defaultPerishabilityHours: 4,
    densityCategory: 'high',
    servingWeightKg: 0.20, // 200g typical portion
    distributionEase: 82,
    handlingNotes: 'Requires rapid thermal control (maintain above 60°C or chill below 4°C).',
    typicalRoutes: ['REDISTRIBUTE', 'ORGANIC'],
    sourceCitation: 'USDA Food Safety and Inspection Service (FSIS) Safe Food Handling.'
  },
  {
    id: 'bread-pastries',
    name: 'Bread & Pastries',
    category: 'bakery',
    defaultPerishabilityHours: 48,
    densityCategory: 'low',
    servingWeightKg: 0.12, // 120g typical serving
    distributionEase: 95,
    handlingNotes: 'Ambient stable, high transport compatibility, easily portioned.',
    typicalRoutes: ['REDISTRIBUTE', 'PROCESS', 'ORGANIC'],
    sourceCitation: 'FAO Technical Platform on the Measurement and Reduction of Food Loss.'
  },
  {
    id: 'prepared-meals',
    name: 'Prepared Buffet & Cooked Meals',
    category: 'prepared',
    defaultPerishabilityHours: 3,
    densityCategory: 'medium',
    servingWeightKg: 0.35, // 350g complete meal
    distributionEase: 75,
    handlingNotes: 'Strict time-temperature window for direct redistribution.',
    typicalRoutes: ['REDISTRIBUTE', 'ORGANIC'],
    sourceCitation: 'UNEP Food Waste Index & Commercial Kitchen Protocol.'
  },
  {
    id: 'fresh-vegetables',
    name: 'Fresh Leafy & Root Vegetables',
    category: 'produce',
    defaultPerishabilityHours: 72,
    densityCategory: 'medium',
    servingWeightKg: 0.25,
    distributionEase: 88,
    handlingNotes: 'Resilient for processing and community kitchens if physically sound.',
    typicalRoutes: ['REDISTRIBUTE', 'PROCESS', 'ORGANIC'],
    sourceCitation: 'FAO Post-harvest Loss Assessment Database.'
  },
  {
    id: 'fruits',
    name: 'Fresh Fruits (Orchard & Citrus)',
    category: 'produce',
    defaultPerishabilityHours: 96,
    densityCategory: 'medium',
    servingWeightKg: 0.20,
    distributionEase: 90,
    handlingNotes: 'High direct value; suitable for processing into purées or direct snacking.',
    typicalRoutes: ['REDISTRIBUTE', 'PROCESS', 'ORGANIC'],
    sourceCitation: 'FAO Global Food Losses and Food Waste.'
  },
  {
    id: 'packaged-dry-goods',
    name: 'Packaged & Dry Groceries',
    category: 'packaged',
    defaultPerishabilityHours: 720, // 30 days
    densityCategory: 'high',
    servingWeightKg: 0.30,
    distributionEase: 98,
    handlingNotes: 'Shelf-stable, minimal temperature risk, ideal for food bank pantry reserves.',
    typicalRoutes: ['REDISTRIBUTE'],
    sourceCitation: 'ReFED Standard Food Recovery Guidelines.'
  },
  {
    id: 'dairy-beverages',
    name: 'Dairy & Plant Beverages',
    category: 'dairy',
    defaultPerishabilityHours: 12,
    densityCategory: 'medium',
    servingWeightKg: 0.25,
    distributionEase: 70,
    handlingNotes: 'Requires unbroken cold chain (below 4°C).',
    typicalRoutes: ['REDISTRIBUTE', 'PROCESS'],
    sourceCitation: 'International Dairy Federation Food Loss Mitigation Protocol.'
  },
  {
    id: 'other',
    name: 'Other Edible Surplus',
    category: 'prepared',
    defaultPerishabilityHours: 6,
    densityCategory: 'medium',
    servingWeightKg: 0.30,
    distributionEase: 80,
    handlingNotes: 'Requires manual verification of safe holding temperatures and container integrity.',
    typicalRoutes: ['REDISTRIBUTE', 'PROCESS', 'ORGANIC'],
    sourceCitation: 'REPLATE Prototype Assumption.'
  }
];

export const SOURCE_CONTEXTS = [
  { id: 'Catering', name: 'Catering & Banquet Service', typicalUrgency: 'High', avgVolume: 'Medium-Large' },
  { id: 'Restaurant', name: 'Restaurant / Commercial Dining', typicalUrgency: 'High', avgVolume: 'Small-Medium' },
  { id: 'Retail', name: 'Supermarket / Grocery Retail', typicalUrgency: 'Medium', avgVolume: 'Medium' },
  { id: 'Event', name: 'Conference / Large Event', typicalUrgency: 'High', avgVolume: 'Large' },
  { id: 'Bakery', name: 'Artisan / Commercial Bakery', typicalUrgency: 'Medium', avgVolume: 'Medium' },
  { id: 'School', name: 'School / Institutional Canteen', typicalUrgency: 'High', avgVolume: 'Medium' },
  { id: 'Household', name: 'Household / Neighborhood', typicalUrgency: 'Low', avgVolume: 'Small' },
  { id: 'Other', name: 'Other Supply Chain Node', typicalUrgency: 'Medium', avgVolume: 'Variable' }
];

export const CONDITION_OPTIONS = [
  {
    id: 'fresh_excellent',
    label: 'Fresh / Excellent Condition',
    scoreFactor: 98,
    description: 'Recently prepared or harvested, stored in proper temperature containment.',
    recommendedRoute: 'REDISTRIBUTE'
  },
  {
    id: 'suitable',
    label: 'Still Suitable / Wholesome',
    scoreFactor: 88,
    description: 'Good sensory quality, clean handling, suitable for immediate consumption or cooking.',
    recommendedRoute: 'REDISTRIBUTE'
  },
  {
    id: 'near_window',
    label: 'Near End of Usable Window',
    scoreFactor: 64,
    description: 'Requires immediate redistribution or secondary culinary processing today.',
    recommendedRoute: 'PROCESS'
  },
  {
    id: 'not_suitable',
    label: 'Not Suitable for Direct Redistribution',
    scoreFactor: 22,
    description: 'Sensory degradation or broken temperature threshold. Safe only for composting / bio-recovery.',
    recommendedRoute: 'ORGANIC'
  }
];

export const TIME_WINDOWS = [
  { id: 'under_1h', label: 'Under 1 hour (Immediate urgency)', hours: 0.8, urgencyScore: 98 },
  { id: '1_3h', label: '1 to 3 hours (High urgency)', hours: 2.5, urgencyScore: 90 },
  { id: '3_6h', label: '3 to 6 hours (Moderate window)', hours: 5.0, urgencyScore: 78 },
  { id: 'over_6h', label: 'More than 6 hours (Flexible window)', hours: 12.0, urgencyScore: 65 }
];
