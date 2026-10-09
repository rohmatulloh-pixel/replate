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
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    // User requested: "hapus semua data demo, jangan buat data palsu"
    // Purge any demo or fake items that may have been stored previously
    const realReports = list.filter(r => !r.isDemo && !String(r.id || '').startsWith('demo-'));
    if (realReports.length !== list.length) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(realReports));
      localStorage.removeItem(STORAGE_KEYS.DEMO_FLAG);
    }
    return realReports;
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
 * Check if demo mode is active (always false as demo data is prohibited)
 */
export function isDemoMode() {
  return false;
}

/**
 * Deprecated / safe cleaner for legacy demo data requests
 */
export function loadDemoData() {
  clearAllData();
  return [];
}

