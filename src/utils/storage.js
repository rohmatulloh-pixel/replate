/**
 * REPLATE Centralized LocalStorage Utility
 * Manages reports, journey logs, impact data, and demo modes with zero external database dependencies.
 */

const STORAGE_KEYS = {
  REPORTS: 'replate_surplus_reports_v1',
  PREFERENCES: 'replate_user_preferences_v1',
  DEMO_FLAG: 'replate_demo_loaded_v1'
};

// Custom event to sync components upon storage updates
const dispatchStorageEvent = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('replate:storage-update'));
  }
};

/**
 * Get all surplus reports from localStorage
 */
export function getReports() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('[REPLATE Storage] Error reading reports:', err);
    return [];
  }
}

/**
 * Get single report by ID
 */
export function getReportById(id) {
  const reports = getReports();
  return reports.find(r => r.id === id) || null;
}

/**
 * Save a new surplus report
 */
export function saveReport(report) {
  try {
    const reports = getReports();
    const newReport = {
      ...report,
      id: report.id || `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: report.createdAt || new Date().toISOString(),
      journeyEvents: report.journeyEvents || [
        {
          status: 'REPORTED',
          timestamp: new Date().toISOString(),
          note: `Surplus recorded: ${report.quantity} ${report.unit} ${report.foodName || 'Food'}`
        }
      ]
    };

    const updated = [newReport, ...reports];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
    dispatchStorageEvent();
    return newReport;
  } catch (err) {
    console.error('[REPLATE Storage] Error saving report:', err);
    throw err;
  }
}

/**
 * Update an existing report
 */
export function updateReport(id, updates) {
  try {
    const reports = getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index === -1) return null;

    reports[index] = {
      ...reports[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    dispatchStorageEvent();
    return reports[index];
  } catch (err) {
    console.error('[REPLATE Storage] Error updating report:', err);
    throw err;
  }
}

/**
 * Update Journey Status and append timeline event
 */
export function updateJourneyStatus(id, newStatus, note = '') {
  const report = getReportById(id);
  if (!report) return null;

  const currentEvents = report.journeyEvents || [];
  const newEvent = {
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status progressed to ${newStatus.replace('_', ' ')}`
  };

  return updateReport(id, {
    journeyStatus: newStatus,
    journeyEvents: [...currentEvents, newEvent]
  });
}

/**
 * Delete a report
 */
export function deleteReport(id) {
  try {
    const reports = getReports();
    const filtered = reports.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));
    dispatchStorageEvent();
    return true;
  } catch (err) {
    console.error('[REPLATE Storage] Error deleting report:', err);
    return false;
  }
}

/**
 * Clear all surplus data
 */
export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_FLAG);
    dispatchStorageEvent();
    return true;
  } catch (err) {
    console.error('[REPLATE Storage] Error clearing data:', err);
    return false;
  }
}

/**
 * Check if demo data is currently loaded
 */
export function isDemoMode() {
  const reports = getReports();
  return reports.some(r => r.isDemo === true);
}

/**
 * Load competition-ready demo scenario
 * Scenario includes:
 * 1. Cooked Rice 8 kg (Catering, 91 score, Community Kitchen Alpha, in-transit)
 * 2. Fresh Vegetables 4.2 kg (Restaurant, 86 score, Civic Shelter, completed)
 * 3. Bread & Pastries 3.0 kg (Retail, 74 score, Upcycling Lab, completed)
 * 4. Prepared Buffet Meals 9.4 kg (Event, 93 score, Community Kitchen Alpha, received)
 */
export function loadDemoData() {
  const now = Date.now();
  const formatIsoAgo = (minutesAgo) => new Date(now - (minutesAgo * 60 * 1000)).toISOString();

  const demoReports = [
    {
      id: 'demo-rice-8kg',
      isDemo: true,
      foodTypeId: 'cooked-rice',
      foodName: 'Cooked Rice',
      category: 'prepared',
      quantity: 8,
      unit: 'kg',
      conditionId: 'suitable',
      conditionLabel: 'Still suitable / Wholesome',
      timeWindowId: '1_3h',
      availableTimeLabel: '1 to 3 hours (High urgency)',
      sourceContextId: 'Catering',
      notes: 'Unserved tray from corporate luncheon banquet. Held in thermal transport boxes.',
      createdAt: formatIsoAgo(58),
      rescueScore: 91,
      priority: 'HIGH PRIORITY',
      recommendedRoute: 'REDISTRIBUTE',
      routeWhy: [
        'Suitable reported condition and intact thermal holding.',
        'High urgency (under 3 hour window) demands rapid evening service intake.',
        'Destination has open capacity for warm staple redistribution.'
      ],
      selectedDestination: {
        id: 'dest-kitchen-a',
        name: 'Community Kitchen Alpha',
        type: 'Community Kitchen',
        matchScore: 94,
        demoDistanceKm: 2.4,
        operatingWindow: 'Open until 21:00 (Evening Service Active)'
      },
      journeyStatus: 'RESCUE_INITIATED',
      journeyEvents: [
        {
          status: 'REPORTED',
          timestamp: formatIsoAgo(58),
          note: '8 kg Cooked Rice recorded from catering luncheon'
        },
        {
          status: 'ASSESSED',
          timestamp: formatIsoAgo(52),
          note: 'Calculated 91/100 Rescue Score. Priority flagged as HIGH.'
        },
        {
          status: 'ROUTE_SELECTED',
          timestamp: formatIsoAgo(48),
          note: 'Route confirmed: Direct Redistribution'
        },
        {
          status: 'MATCHED',
          timestamp: formatIsoAgo(42),
          note: 'Matched with Community Kitchen Alpha (94% compatibility)'
        },
        {
          status: 'RESCUE_INITIATED',
          timestamp: formatIsoAgo(20),
          note: 'Driver dispatched with insulated thermal Cambro container.'
        }
      ]
    },
    {
      id: 'demo-veg-4kg',
      isDemo: true,
      foodTypeId: 'fresh-vegetables',
      foodName: 'Fresh Leafy & Root Vegetables',
      category: 'produce',
      quantity: 4.2,
      unit: 'kg',
      conditionId: 'fresh_excellent',
      conditionLabel: 'Fresh / Excellent Condition',
      timeWindowId: '3_6h',
      availableTimeLabel: '3 to 6 hours (Moderate window)',
      sourceContextId: 'Restaurant',
      notes: 'Crisp prep trimmings and uncut greens from bistro dinner prep.',
      createdAt: formatIsoAgo(180),
      rescueScore: 86,
      priority: 'HIGH PRIORITY',
      recommendedRoute: 'REDISTRIBUTE',
      routeWhy: [
        'Excellent fresh condition, ideal for community dinner stews.',
        'Sufficient cold window for safe handoff.'
      ],
      selectedDestination: {
        id: 'dest-center-c',
        name: 'Civic Shelter & Community Center C',
        type: 'Shelter Meal Program',
        matchScore: 91,
        demoDistanceKm: 3.9,
        operatingWindow: '24/7 Intake for wholesome prepared hot food'
      },
      journeyStatus: 'RECEIVED',
      journeyEvents: [
        {
          status: 'REPORTED',
          timestamp: formatIsoAgo(180),
          note: '4.2 kg Fresh Vegetables reported by Bistro'
        },
        {
          status: 'ASSESSED',
          timestamp: formatIsoAgo(172),
          note: '86 Rescue Score calculated'
        },
        {
          status: 'MATCHED',
          timestamp: formatIsoAgo(165),
          note: 'Matched with Civic Shelter & Community Center C'
        },
        {
          status: 'RESCUE_INITIATED',
          timestamp: formatIsoAgo(140),
          note: 'Pickup completed by shelter volunteer van'
        },
        {
          status: 'RECEIVED',
          timestamp: formatIsoAgo(95),
          note: 'Successfully checked in and incorporated into nightly soup.'
        }
      ]
    },
    {
      id: 'demo-bread-3kg',
      isDemo: true,
      foodTypeId: 'bread-pastries',
      foodName: 'Bread & Pastries',
      category: 'bakery',
      quantity: 3.0,
      unit: 'kg',
      conditionId: 'near_window',
      conditionLabel: 'Near end of usable window',
      timeWindowId: 'over_6h',
      availableTimeLabel: 'More than 6 hours (Flexible window)',
      sourceContextId: 'Retail',
      notes: 'Day-old artisan sourdough loaves and baguettes.',
      createdAt: formatIsoAgo(340),
      rescueScore: 74,
      priority: 'MEDIUM PRIORITY',
      recommendedRoute: 'PROCESS',
      routeWhy: [
        'Bread near shelf window is ideal for culinary transformation.',
        'Direct upcycling into garlic croutons and breadcrumbs.'
      ],
      selectedDestination: {
        id: 'dest-processing-e',
        name: 'Circular Food Transformation Hub E',
        type: 'Upcycling & Processing Lab',
        matchScore: 88,
        demoDistanceKm: 7.5,
        operatingWindow: 'Intake daily 09:00 - 19:00'
      },
      journeyStatus: 'RECEIVED',
      journeyEvents: [
        {
          status: 'REPORTED',
          timestamp: formatIsoAgo(340),
          note: '3.0 kg Artisan Loaves recorded at bakery closing'
        },
        {
          status: 'ASSESSED',
          timestamp: formatIsoAgo(330),
          note: 'Assessed for secondary processing route'
        },
        {
          status: 'MATCHED',
          timestamp: formatIsoAgo(310),
          note: 'Matched to Circular Food Transformation Hub E'
        },
        {
          status: 'RESCUE_INITIATED',
          timestamp: formatIsoAgo(260),
          note: 'Consolidated into scheduled evening route'
        },
        {
          status: 'RECEIVED',
          timestamp: formatIsoAgo(200),
          note: 'Dehydrated and milled into shelf-stable seasoned breading.'
        }
      ]
    },
    {
      id: 'demo-buffet-9kg',
      isDemo: true,
      foodTypeId: 'prepared-meals',
      foodName: 'Prepared Buffet & Cooked Meals',
      category: 'prepared',
      quantity: 9.4,
      unit: 'kg',
      conditionId: 'fresh_excellent',
      conditionLabel: 'Fresh / Excellent Condition',
      timeWindowId: '1_3h',
      availableTimeLabel: '1 to 3 hours (High urgency)',
      sourceContextId: 'Event',
      notes: 'Protected chafing dishes of baked salmon and roasted potatoes.',
      createdAt: formatIsoAgo(480),
      rescueScore: 93,
      priority: 'HIGH PRIORITY',
      recommendedRoute: 'REDISTRIBUTE',
      routeWhy: [
        'Pristine unserved proteins with verified temperature logs.',
        'High community caloric value.'
      ],
      selectedDestination: {
        id: 'dest-kitchen-a',
        name: 'Community Kitchen Alpha',
        type: 'Community Kitchen',
        matchScore: 96,
        demoDistanceKm: 2.4,
        operatingWindow: 'Open until 21:00 (Evening Service Active)'
      },
      journeyStatus: 'RECEIVED',
      journeyEvents: [
        {
          status: 'REPORTED',
          timestamp: formatIsoAgo(480),
          note: 'Conference banquet concluded with intact surplus'
        },
        {
          status: 'ASSESSED',
          timestamp: formatIsoAgo(465),
          note: '93 Rescue Score awarded'
        },
        {
          status: 'MATCHED',
          timestamp: formatIsoAgo(450),
          note: 'Matched to Alpha Kitchen'
        },
        {
          status: 'RESCUE_INITIATED',
          timestamp: formatIsoAgo(420),
          note: 'Intake van loaded'
        },
        {
          status: 'RECEIVED',
          timestamp: formatIsoAgo(370),
          note: 'Plated for 27 family dinners'
        }
      ]
    }
  ];

  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(demoReports));
  localStorage.setItem(STORAGE_KEYS.DEMO_FLAG, 'true');
  dispatchStorageEvent();
  return demoReports;
}
