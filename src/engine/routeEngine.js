/**
 * REPLATE Route Engine
 * Deterministic, rule-based decision engine to assign the most appropriate route:
 * - REDISTRIBUTE (Direct human nourishment)
 * - PROCESS (Culinary transformation & upcycling)
 * - ORGANIC (Composting & biological energy recovery)
 */

import { ROUTES } from '../data/rules.js';
import { FOOD_TYPES } from '../data/foods.js';

export function determineRoute({
  foodTypeId,
  conditionId,
  timeWindowId
}) {
  const foodType = FOOD_TYPES.find(f => f.id === foodTypeId) || FOOD_TYPES[FOOD_TYPES.length - 1];

  let selectedRoute = ROUTES.REDISTRIBUTE;
  const whyPoints = [];

  // Deterministic Safety Gate 1: If condition is Not Suitable for direct consumption
  if (conditionId === 'not_suitable') {
    selectedRoute = ROUTES.ORGANIC;
    whyPoints.push('Reported condition is past direct edible redistribution standards.');
    whyPoints.push('Directing to aerobic composting or bio-energy avoids landfill methane generation.');
    whyPoints.push('Protects recipient community health by observing strict food safety protocols.');
    
    return {
      route: selectedRoute.id,
      routeMeta: selectedRoute,
      why: whyPoints,
      safetyNotice: 'Material flagged for organic recovery. Do not offer for human consumption.'
    };
  }

  // Deterministic Rule 2: Near end of usable window + perishable produce / bakery
  if (conditionId === 'near_window') {
    if (foodType.category === 'produce' || foodType.category === 'bakery') {
      selectedRoute = ROUTES.PROCESS;
      whyPoints.push(`Ingredient category (${foodType.name}) is prime for culinary transformation.`);
      whyPoints.push('Upcycling into broths, purées, sauces, or croutons extends shelf-life by 3–14 days.');
      whyPoints.push('Avoids urgency bottleneck of direct hot-meal transport.');
    } else {
      // Prepared food near end of window with very tight time
      if (timeWindowId === 'under_1h') {
        selectedRoute = ROUTES.REDISTRIBUTE;
        whyPoints.push('Critical immediate window: direct drop-off at nearest soup kitchen before window lapses.');
        whyPoints.push('Food is still reported as suitable for consumption if served promptly.');
      } else {
        selectedRoute = ROUTES.PROCESS;
        whyPoints.push('Secondary processing recommended to safely preserve surplus before serving window expires.');
      }
    }
  } else {
    // Deterministic Rule 3: Fresh or wholesome condition -> Direct REDISTRIBUTE
    selectedRoute = ROUTES.REDISTRIBUTE;
    whyPoints.push('Reported condition is wholesome and meets direct consumption criteria.');
    whyPoints.push(`High community utility: provides immediate nourishment for community meal programs.`);
    whyPoints.push('Active local community kitchens and shelters have intake demand for this category.');
    if (timeWindowId === 'under_1h' || timeWindowId === '1_3h') {
      whyPoints.push('High time urgency requires immediate dispatch to near-proximity partners.');
    }
  }

  return {
    route: selectedRoute.id,
    routeMeta: selectedRoute,
    why: whyPoints,
    safetyNotice: 'Decision support recommendation only. Receiver must verify physical temperature and organoleptic properties upon receipt.'
  };
}
