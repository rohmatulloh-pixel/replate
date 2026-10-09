/**
 * REPLATE Destination Matching Engine
 * Ranks simulated destinations based on multi-factor compatibility.
 * 
 * Factors:
 * - Food Type Compatibility (30%)
 * - Route Compatibility (20%)
 * - Capacity Fit (15%)
 * - Time Compatibility (15%)
 * - Proximity / Distance (10%)
 * - Need Urgency (10%)
 */

import { MATCHING_WEIGHTS } from '../data/rules.js';
import { DESTINATIONS } from '../data/destinations.js';
import { FOOD_TYPES } from '../data/foods.js';

export function matchDestinations({
  foodTypeId,
  quantity,
  unit = 'kg',
  recommendedRoute,
  timeWindowId
}, lang = 'id') {
  const foodType = FOOD_TYPES.find(f => f.id === foodTypeId) || FOOD_TYPES[0];
  const qtyInKg = unit === 'portions' ? quantity * 0.35 : Number(quantity) || 1;

  const scoredList = DESTINATIONS.map(dest => {
    // 1. Food Type Compatibility (0-100)
    let foodCompat = 40;
    if (dest.acceptedFoodTypes.includes(foodType.id)) {
      foodCompat = 100;
    } else if (dest.acceptedCategories.includes(foodType.category)) {
      foodCompat = 85;
    }

    // 2. Route Compatibility (0-100)
    let routeCompat = 30;
    if (dest.preferredRoutes.includes(recommendedRoute)) {
      routeCompat = 100;
    } else if (recommendedRoute === 'REDISTRIBUTE' && dest.preferredRoutes.includes('PROCESS')) {
      routeCompat = 70;
    }

    // 3. Capacity Fit (0-100)
    let capacityFit = 80;
    if (dest.currentAvailableCapacityKg >= qtyInKg) {
      capacityFit = 95;
    } else if (dest.currentAvailableCapacityKg >= qtyInKg * 0.5) {
      capacityFit = 65; // Can take partial or needs minor coordination
    } else {
      capacityFit = 30; // Near capacity limit
    }

    // 4. Time Window Compatibility (0-100)
    let timeCompat = 80;
    if (timeWindowId === 'under_1h') {
      // Shorter distance and open right now matters heavily
      timeCompat = dest.demoDistanceKm <= 3.5 ? 98 : 70;
    } else if (timeWindowId === '1_3h') {
      timeCompat = dest.demoDistanceKm <= 6.0 ? 94 : 80;
    } else {
      timeCompat = 90;
    }

    // 5. Distance Factor (0-100)
    // Closer is higher score: 1km -> 100, 10km -> 60
    const distanceScore = Math.max(30, Math.min(100, Math.round(100 - (dest.demoDistanceKm * 3.5))));

    // 6. Destination Need (0-100)
    const needScore = dest.needScore || 75;

    // Weighted Total Score
    const rawTotal = 
      (foodCompat * MATCHING_WEIGHTS.foodCompatibility) +
      (routeCompat * MATCHING_WEIGHTS.routeCompatibility) +
      (capacityFit * MATCHING_WEIGHTS.capacityFit) +
      (timeCompat * MATCHING_WEIGHTS.timeCompatibility) +
      (distanceScore * MATCHING_WEIGHTS.distance) +
      (needScore * MATCHING_WEIGHTS.destinationNeed);

    const matchScore = Math.min(100, Math.max(20, Math.round(rawTotal)));

    // Compatibility Checklist
    const checklist = lang === 'id' ? [
      { label: 'Kesesuaian jenis pangan', passed: foodCompat >= 80, detail: dest.acceptedFoodTypes.includes(foodType.id) ? 'Kecocokan langsung' : 'Kategori sesuai' },
      { label: 'Kesesuaian rute penanganan', passed: routeCompat >= 80, detail: `Mendukung rute ${recommendedRoute}` },
      { label: 'Kapasitas penerimaan', passed: capacityFit >= 80, detail: `Kapasitas intake ${dest.currentAvailableCapacityKg} kg` },
      { label: 'Kesesuaian jam intake', passed: timeCompat >= 80, detail: dest.operatingWindow },
      { label: 'Jarak & kedekatan', passed: distanceScore >= 70, detail: `${dest.demoDistanceKm} km dari lokasi` },
      { label: 'Tingkat urgensi kebutuhan', passed: needScore >= 75, detail: `Prioritas kebutuhan ${dest.urgencyNeed === 'high' ? 'TINGGI' : dest.urgencyNeed === 'medium' ? 'SEDANG' : 'STANDAR'}` }
    ] : [
      { label: 'Food compatibility', passed: foodCompat >= 80, detail: dest.acceptedFoodTypes.includes(foodType.id) ? 'Direct match' : 'Category fit' },
      { label: 'Route compatibility', passed: routeCompat >= 80, detail: `${recommendedRoute} supported` },
      { label: 'Capacity available', passed: capacityFit >= 80, detail: `${dest.currentAvailableCapacityKg} kg intake capacity` },
      { label: 'Time window match', passed: timeCompat >= 80, detail: dest.operatingWindow },
      { label: 'Proximity / Distance', passed: distanceScore >= 70, detail: `${dest.demoDistanceKm} km away` },
      { label: 'Community urgency need', passed: needScore >= 75, detail: `${dest.urgencyNeed.toUpperCase()} need level` }
    ];

    // Explainable rationale
    const rationale = lang === 'id' ? [
      dest.acceptedFoodTypes.includes(foodType.id) ? `Menerima langsung jenis ${foodType.name}` : `Menerima kategori ${foodType.category}`,
      `Kapasitas intake ${dest.currentAvailableCapacityKg} kg siap menampung ${qtyInKg.toFixed(1)} kg`,
      `Berjarak ${dest.demoDistanceKm} km dengan jendela intake terbuka`
    ] : [
      dest.acceptedFoodTypes.includes(foodType.id) ? `Directly accepts ${foodType.name}` : `Accepts ${foodType.category} category`,
      `Intake capacity of ${dest.currentAvailableCapacityKg} kg easily handles ${qtyInKg.toFixed(1)} kg`,
      `Located ${dest.demoDistanceKm} km away with open intake operating window`
    ];

    return {
      destination: dest,
      matchScore,
      checklist,
      rationale,
      factors: {
        foodCompat,
        routeCompat,
        capacityFit,
        timeCompat,
        distanceScore,
        needScore
      }
    };
  });

  // Sort descending by matchScore
  return scoredList.sort((a, b) => b.matchScore - a.matchScore);
}
