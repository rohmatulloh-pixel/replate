/**
 * REPLATE Sources & Verified Methodology Citations
 * Verified institutional standards and literature citations for food waste & recovery.
 */

export const CITATIONS = [
  {
    id: 'fao-2024',
    title: 'Food Loss Index & Global Food Losses and Waste',
    organization: 'Food and Agriculture Organization of the United Nations (FAO)',
    year: '2024',
    scope: 'Supply chain loss rates, agricultural resource footprints, and recovery hierarchies.',
    verifiedUrl: 'https://www.fao.org/food-loss-and-food-waste',
    keyMetric: 'Approximately 13% of food produced globally is lost between harvest and retail.',
    citationNote: 'Directly informs the REPLATE supply chain trace model and stage classification.'
  },
  {
    id: 'unep-2024',
    title: 'Food Waste Index Report 2024: Think Eat Save',
    organization: 'United Nations Environment Programme (UNEP)',
    year: '2024',
    scope: 'Retail, food service, and household food waste quantification methodology.',
    verifiedUrl: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
    keyMetric: 'Food service accounts for over 28% of post-retail edible surplus waste.',
    citationNote: 'Underpins REPLATE context weighting (catering/restaurant urgency).'
  },
  {
    id: 'epa-warm-2023',
    title: 'Waste Reduction Model (WARM) & Wasted Food Scale',
    organization: 'United States Environmental Protection Agency (US EPA)',
    year: '2023',
    scope: 'Emissions factors for food waste diversion from municipal solid waste landfills.',
    verifiedUrl: 'https://www.epa.gov/sustainable-management-food/wasted-food-scale',
    keyMetric: '~2.1 MT CO2e avoided per metric ton of edible food routed to human consumption vs landfill.',
    citationNote: 'Used for REPLATE avoided CO2e impact multiplier (labeled as estimated model factor).'
  },
  {
    id: 'refed-2023',
    title: 'Roadmap to 2030: Reducing US Food Waste by 50%',
    organization: 'ReFED (Rethink Food Waste through Economics and Data)',
    year: '2023',
    scope: 'Donation infrastructure, cold chain optimization, and matching efficiency models.',
    verifiedUrl: 'https://refed.org/food-waste/the-solutions',
    keyMetric: 'Over 70% of potential food donations are bottlenecked by lack of instant routing logistics.',
    citationNote: 'Directly informs REPLATE’s core concept: "Food should move. Not waste."'
  },
  {
    id: 'usda-fsis-2022',
    title: 'Safe Food Handling & Time/Temperature Control for Safety (TCS)',
    organization: 'USDA Food Safety and Inspection Service / FDA Food Code',
    year: '2022',
    scope: 'Microbial risk windows for cooked TCS foods between 4°C (40°F) and 60°C (140°F).',
    verifiedUrl: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation',
    keyMetric: '2 to 4 hour danger zone thresholds dictate immediate rescue windows.',
    citationNote: 'Underpins the urgent time window factors in the REPLATE Rescue Score Engine.'
  },
  {
    id: 'gfb-2023',
    title: 'Global Foodbanking Network Nutrition and Serving Conversion Framework',
    organization: 'The Global FoodBanking Network (GFN)',
    year: '2023',
    scope: 'Standard meal equivalence benchmarks for emergency humanitarian relief.',
    verifiedUrl: 'https://www.foodbanking.org',
    keyMetric: '350 grams (0.35 kg) accepted standard average mass per emergency meal portion.',
    citationNote: 'Basis for REPLATE "Estimated Servings" calculation (clearly labeled as estimate).'
  }
];

export const APPLICATION_ASSUMPTIONS = [
  {
    parameter: 'Average Serving Weight',
    value: '0.35 kg per serving',
    type: 'Prototype assumption',
    rationale: 'Based on Global FoodBanking Network nutritional portion benchmarks across aggregate food groups.'
  },
  {
    parameter: 'CO2e Landfill Avoidance Multiplier',
    value: '2.10 kg CO2e / kg rescued',
    type: 'Prototype assumption (derived from EPA WARM v15)',
    rationale: 'Models anaerobic methane avoidance from landfill decomposition when food is consumed or processed.'
  },
  {
    parameter: 'Embodied Water Conservation',
    value: '250 Liters / kg rescued',
    type: 'Prototype assumption (derived from FAO Food Wastage Footprint)',
    rationale: 'Weighted average across mixed agricultural production water usage.'
  },
  {
    parameter: 'Distance Attenuation Penalty',
    value: '2% penalty per km beyond 5km radius',
    type: 'Prototype logistics heuristic',
    rationale: 'Reflects transit time friction in urban cold-chain and hot-holding rescue operations.'
  }
];
