/**
 * REPLATE Text & Value Formatters
 */

export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoString;
  }
}

export function formatTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString) {
  if (!isoString) return '—';
  try {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
}

export function formatWeight(kg) {
  const num = Number(kg) || 0;
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}

export function getPriorityTheme(priority) {
  switch (priority) {
    case 'HIGH PRIORITY':
      return {
        bg: 'bg-forest-50',
        text: 'text-forest-900',
        border: 'border-forest-700/20',
        dot: 'bg-forest-600'
      };
    case 'MEDIUM PRIORITY':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-900',
        border: 'border-amber-600/20',
        dot: 'bg-amber-600'
      };
    case 'LOW PRIORITY':
    default:
      return {
        bg: 'bg-stone-100',
        text: 'text-stone-700',
        border: 'border-stone-300',
        dot: 'bg-stone-500'
      };
  }
}

export function getRouteTheme(route) {
  switch (route) {
    case 'REDISTRIBUTE':
      return {
        label: 'Direct Redistribution',
        bg: 'bg-forest-900',
        text: 'text-ivory-50',
        tagBg: 'bg-forest-50',
        tagText: 'text-forest-900',
        border: 'border-forest-800'
      };
    case 'PROCESS':
      return {
        label: 'Culinary Processing',
        bg: 'bg-sage-600',
        text: 'text-white',
        tagBg: 'bg-sage-50',
        tagText: 'text-sage-800',
        border: 'border-sage-500'
      };
    case 'ORGANIC':
    default:
      return {
        label: 'Organic Recovery',
        bg: 'bg-[#8C6843]',
        text: 'text-white',
        tagBg: 'bg-amber-50',
        tagText: 'text-[#8C6843]',
        border: 'border-[#8C6843]'
      };
  }
}

export function getJourneyStatusMeta(status) {
  switch (status) {
    case 'REPORTED':
      return { label: 'Surplus Reported', step: 1, color: 'text-charcoal-700 bg-stone-100' };
    case 'ASSESSED':
      return { label: 'Assessed & Scored', step: 2, color: 'text-charcoal-800 bg-stone-200' };
    case 'ROUTE_SELECTED':
      return { label: 'Route Confirmed', step: 3, color: 'text-sage-800 bg-sage-100' };
    case 'MATCHED':
      return { label: 'Destination Matched', step: 4, color: 'text-sage-900 bg-sage-200' };
    case 'RESCUE_INITIATED':
      return { label: 'In Transit', step: 5, color: 'text-terracotta-500 bg-terracotta-50' };
    case 'RECEIVED':
      return { label: 'Rescued & Received', step: 6, color: 'text-forest-900 bg-forest-100 font-semibold' };
    default:
      return { label: status, step: 1, color: 'text-charcoal-600 bg-stone-100' };
  }
}
