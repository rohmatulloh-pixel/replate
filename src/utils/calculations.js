/**
 * REPLATE Calculations & Impact Analytics
 * Aggregates local-first report datasets into transparent metrics and insights.
 */

import { METRIC_ASSUMPTIONS } from '../data/rules.js';

export function calculateImpactSummary(reports = []) {
  if (!reports || reports.length === 0) {
    return {
      totalReports: 0,
      totalRescuedKg: 0,
      totalActiveKg: 0,
      totalHandledKg: 0,
      completedJourneys: 0,
      activeJourneys: 0,
      successfulMatches: 0,
      estimatedServings: 0,
      estimatedCo2eAvoidedKg: 0,
      estimatedWaterSavedLiters: 0,
      routeDistribution: { REDISTRIBUTE: 0, PROCESS: 0, ORGANIC: 0 },
      categoryDistribution: {},
      destinationDistribution: {}
    };
  }

  let totalRescuedKg = 0;
  let totalActiveKg = 0;
  let totalHandledKg = 0;
  let completedJourneys = 0;
  let activeJourneys = 0;
  let successfulMatches = 0;

  const routeDistribution = { REDISTRIBUTE: 0, PROCESS: 0, ORGANIC: 0 };
  const categoryDistribution = {};
  const destinationDistribution = {};

  reports.forEach(rep => {
    // Standardize weight to kg
    const kg = rep.unit === 'portions' ? (rep.quantity * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG) : Number(rep.quantity) || 0;
    totalHandledKg += kg;

    if (rep.journeyStatus === 'RECEIVED') {
      totalRescuedKg += kg;
      completedJourneys += 1;
    } else if (rep.journeyStatus === 'RESCUE_INITIATED' || rep.journeyStatus === 'MATCHED') {
      totalActiveKg += kg;
      activeJourneys += 1;
    }

    if (rep.selectedDestination) {
      successfulMatches += 1;
      const destName = rep.selectedDestination.name || 'Unassigned';
      destinationDistribution[destName] = (destinationDistribution[destName] || 0) + kg;
    }

    const route = rep.recommendedRoute || 'REDISTRIBUTE';
    if (routeDistribution[route] !== undefined) {
      routeDistribution[route] += 1;
    }

    const cat = rep.category || rep.foodTypeId || 'other';
    categoryDistribution[cat] = (categoryDistribution[cat] || 0) + kg;
  });

  // Calculate estimated servings based on transparent formula
  const estimatedServings = Math.round(totalRescuedKg / METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG);
  const estimatedCo2eAvoidedKg = Math.round(totalRescuedKg * METRIC_ASSUMPTIONS.CO2E_FACTOR_PER_KG * 10) / 10;
  const estimatedWaterSavedLiters = Math.round(totalRescuedKg * METRIC_ASSUMPTIONS.WATER_LITERS_PER_KG);

  return {
    totalReports: reports.length,
    totalRescuedKg: Math.round(totalRescuedKg * 10) / 10,
    totalActiveKg: Math.round(totalActiveKg * 10) / 10,
    totalHandledKg: Math.round(totalHandledKg * 10) / 10,
    completedJourneys,
    activeJourneys,
    successfulMatches,
    estimatedServings,
    estimatedCo2eAvoidedKg,
    estimatedWaterSavedLiters,
    routeDistribution,
    categoryDistribution,
    destinationDistribution
  };
}

/**
 * Generate dynamic supply-chain insights from stored reports
 */
export function generateInsights(reports = []) {
  if (!reports || reports.length === 0) {
    return {
      hasData: false,
      message: 'No surplus records available. Report a surplus or load demo data to view pattern analysis.'
    };
  }

  // 1. Most common surplus food
  const foodCounts = {};
  const sourceCounts = {};
  const routeCounts = {};
  let totalScore = 0;
  let scoreCount = 0;

  reports.forEach(r => {
    const fName = r.foodName || r.foodTypeId || 'Unspecified';
    foodCounts[fName] = (foodCounts[fName] || 0) + 1;

    const src = r.sourceContextId || 'General';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;

    const route = r.recommendedRoute || 'REDISTRIBUTE';
    routeCounts[route] = (routeCounts[route] || 0) + 1;

    if (r.rescueScore !== undefined) {
      totalScore += Number(r.rescueScore);
      scoreCount += 1;
    }
  });

  const getTopKey = (obj) => {
    const sorted = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'N/A';
  };

  const topFood = getTopKey(foodCounts);
  const topSource = getTopKey(sourceCounts);
  const topRoute = getTopKey(routeCounts);
  const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

  // Determine structural prevention advice based on top patterns
  let preventionTitle = `Recurrent surplus identified: ${topFood}`;
  let preventionAdvice = `Consider reviewing production planning for ${topFood.toLowerCase()} during ${topSource.toLowerCase()} operations to minimize upstream excess before rescue is required.`;

  if (topSource === 'Catering') {
    preventionAdvice = `Catering events show a repeated surplus of ${topFood.toLowerCase()}. Recommended action: implement a 2-stage progressive pan refill buffer to prevent unserved batch excess.`;
  } else if (topSource === 'Restaurant') {
    preventionAdvice = `Restaurant kitchen records show frequent ${topFood.toLowerCase()} surplus. Consider calibrating prep-station par levels during off-peak shifts.`;
  }

  return {
    hasData: true,
    topFood,
    topSource,
    topRoute,
    avgScore,
    prevention: {
      title: preventionTitle,
      advice: preventionAdvice,
      sourceContext: topSource,
      targetFood: topFood
    },
    rawStats: {
      foodCounts,
      sourceCounts,
      routeCounts
    }
  };
}

/**
 * Prevention Simulator Model
 * Calculates potential surplus reduction under controlled menu portioning scenarios.
 */
export function simulateSurplusReduction(plannedServings, averageSurplusPercent) {
  const currentSurplusServings = (plannedServings * (averageSurplusPercent / 100));
  
  // Scenarios:
  // Conservative improvement (-25% surplus reduction)
  // Moderate improvement (-45% surplus reduction)
  // Progressive shift batching (-65% surplus reduction)
  const conservativeReduction = currentSurplusServings * 0.25;
  const moderateReduction = currentSurplusServings * 0.45;
  const progressiveReduction = currentSurplusServings * 0.65;

  const kgSavedModerate = moderateReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG;
  const co2eSavedModerate = kgSavedModerate * METRIC_ASSUMPTIONS.CO2E_FACTOR_PER_KG;

  return {
    currentSurplusServings: Math.round(currentSurplusServings),
    estimatedWasteKg: Math.round(currentSurplusServings * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10,
    scenarios: {
      conservative: {
        servingsPrevented: Math.round(conservativeReduction),
        kgPrevented: Math.round(conservativeReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10,
        wasteAvoidedKg: Math.round(conservativeReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10
      },
      moderate: {
        servingsPrevented: Math.round(moderateReduction),
        kgPrevented: Math.round(kgSavedModerate * 10) / 10,
        wasteAvoidedKg: Math.round(kgSavedModerate * 10) / 10,
        co2eAvoidedKg: Math.round(co2eSavedModerate * 10) / 10
      },
      progressive: {
        servingsPrevented: Math.round(progressiveReduction),
        kgPrevented: Math.round(progressiveReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10,
        wasteAvoidedKg: Math.round(progressiveReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10
      },
      aggressive: {
        servingsPrevented: Math.round(progressiveReduction),
        kgPrevented: Math.round(progressiveReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10,
        wasteAvoidedKg: Math.round(progressiveReduction * METRIC_ASSUMPTIONS.AVERAGE_SERVING_KG * 10) / 10
      }
    }
  };
}
