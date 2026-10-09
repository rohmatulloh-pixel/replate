/**
 * REPLATE Educational Knowledge Base
 * Structured across five core modules: Understand, Trace, Rescue, Prevent, Impact.
 */

export const LEARN_MODULES = [
  {
    id: 'understand',
    title: 'Understand',
    subtitle: 'The fundamental distinction between surplus and waste',
    icon: 'BookOpen',
    topics: [
      {
        id: 'u1',
        title: 'Surplus vs. Waste: The Decisive Window',
        summary: 'Surplus is edible food in excess of immediate demand. It only becomes waste when it lacks a timely destination route.',
        takeaways: [
          'Surplus is an asset with intact nutritional and economic value.',
          'Waste occurs when logistical latency exceeds food shelf-life.',
          'Routing speed is the single most critical intervention variable.'
        ],
        quote: 'Food becomes waste not when it is excess, but when it is forgotten.'
      },
      {
        id: 'u2',
        title: 'The Real Bottleneck in Recovery',
        summary: 'Most surplus food is discarded not out of malice, but because business operators face high friction in finding qualified recipients during tight operating windows.',
        takeaways: [
          'High coordination costs prevent spontaneous donation.',
          'Fear of food liability creates hesitation without clear protocols.',
          'Decision support eliminates the cognitive burden at end-of-shift.'
        ]
      }
    ]
  },
  {
    id: 'trace',
    title: 'Trace',
    subtitle: 'Where loss and surplus emerge along the food supply chain',
    icon: 'GitFork',
    stages: [
      {
        step: '01',
        name: 'Agricultural Production',
        lossFactor: '14%',
        drivers: 'Cosmetic standards, harvest price fluctuations, weather disruption.',
        routingOpportunity: 'Gleaning networks and secondary processing.'
      },
      {
        step: '02',
        name: 'Post-Harvest & Storage',
        lossFactor: '8%',
        drivers: 'Cold-chain gaps, improper humidity, storage pests.',
        routingOpportunity: 'Dynamic inventory clearance before degradation.'
      },
      {
        step: '03',
        name: 'Processing & Manufacturing',
        lossFactor: '6%',
        drivers: 'Trim waste, batch overruns, package mislabeling.',
        routingOpportunity: 'Upcycling and byproduct valorization.'
      },
      {
        step: '04',
        name: 'Wholesale & Retail',
        lossFactor: '9%',
        drivers: 'Over-ordering, date-label confusion, display overstock.',
        routingOpportunity: 'Food bank bulk collection and discounted clearance.'
      },
      {
        step: '05',
        name: 'Food Service & Catering',
        lossFactor: '17%',
        drivers: 'Unpredictable banquet headcounts, buffer overproduction.',
        routingOpportunity: 'REPLATE rapid same-day hot/chilled redistribution.'
      },
      {
        step: '06',
        name: 'Household Consumption',
        lossFactor: '46%',
        drivers: 'Over-purchasing, lack of meal planning, date misinterpretation.',
        routingOpportunity: 'Neighborhood sharing and organic separation.'
      }
    ]
  },
  {
    id: 'rescue',
    title: 'Rescue',
    subtitle: 'The logistics of matching supply with community demand',
    icon: 'Repeat',
    principles: [
      {
        title: 'Thermal & Time Verification',
        detail: 'Hot foods must remain >60°C or be rapidly cooled to <4°C within 2 hours to maintain pathogen safety.'
      },
      {
        title: 'Capacity-Aware Dispatch',
        detail: 'Matching must account for destination intake limits to avoid shifting the waste burden to volunteer kitchens.'
      },
      {
        title: 'Proximity Prioritization',
        detail: 'Urgent prepared foods need matches within a 5km radius to preserve temperature and minimize transit emissions.'
      }
    ]
  },
  {
    id: 'prevent',
    title: 'Prevent',
    subtitle: 'Eliminating surplus before it enters the kitchen',
    icon: 'ShieldCheck',
    strategies: [
      {
        title: 'Portion & Buffer Calibration',
        detail: 'Reduce standard over-prep buffers from 15% to 5% using progressive cooking in hospitality.'
      },
      {
        title: 'Batch Scheduling in Shifts',
        detail: 'Prepare perishable items in two smaller shifts rather than one large morning bulk batch.'
      },
      {
        title: 'Data-Driven Procurement',
        detail: 'Audit recurrent surplus categories weekly to spot structural ordering mismatches.'
      }
    ]
  },
  {
    id: 'impact',
    title: 'Impact',
    subtitle: 'The ecological and social return on recovered meals',
    icon: 'TrendingUp',
    metrics: [
      {
        label: 'Embodied Energy & Water',
        desc: 'Every kilogram of discarded food also discards the fertilizer, tractor fuel, transport, and 250+ liters of water used to grow it.'
      },
      {
        label: 'Methane Suppression',
        desc: 'Food decaying anaerobically in landfills generates methane—a greenhouse gas over 28x more potent than CO2.'
      },
      {
        label: 'Human Dignity & Nutrition',
        desc: 'Redirecting wholesome meals immediately provides balanced, protein-rich nourishment to food-insecure families.'
      }
    ]
  }
];
