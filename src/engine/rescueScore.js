/**
 * REPLATE Rescue Score Engine
 * Deterministic, explainable, rule-based algorithm.
 * 
 * Formula:
 * Rescue Score = (Condition * 0.30) + (Urgency * 0.25) + (Quantity * 0.15) 
 *              + (DistributionEase * 0.15) + (DestinationFit * 0.15)
 * Normalized to 0–100.
 */

import { RESCUE_SCORE_WEIGHTS, PRIORITY_THRESHOLDS } from '../data/rules.js';
import { FOOD_TYPES, CONDITION_OPTIONS, TIME_WINDOWS } from '../data/foods.js';
import { DESTINATIONS } from '../data/destinations.js';

export function calculateRescueScore({
  foodTypeId,
  quantity,
  unit = 'kg',
  conditionId,
  timeWindowId
}, lang = 'id') {
  // 1. Resolve Food Type
  const foodType = FOOD_TYPES.find(f => f.id === foodTypeId) || FOOD_TYPES[FOOD_TYPES.length - 1];

  // 2. Resolve Condition Factor (0-100)
  const conditionObj = CONDITION_OPTIONS.find(c => c.id === conditionId) || CONDITION_OPTIONS[1];
  const conditionScore = conditionObj.scoreFactor;

  // 3. Resolve Urgency Factor (0-100)
  const timeObj = TIME_WINDOWS.find(t => t.id === timeWindowId) || TIME_WINDOWS[1];
  const urgencyScore = timeObj.urgencyScore;

  // 4. Resolve Quantity Factor (0-100)
  // Convert portions to kg estimate if needed (average portion ~0.35kg)
  const qtyInKg = unit === 'portions' ? Math.max(0.5, quantity * 0.35) : Math.max(0.1, Number(quantity) || 1);
  let quantityScore = 80;
  if (qtyInKg < 2) {
    quantityScore = 75; // Small batch, manageable
  } else if (qtyInKg >= 2 && qtyInKg <= 15) {
    quantityScore = 95; // Ideal sweet spot for community kitchen daily intake
  } else if (qtyInKg > 15 && qtyInKg <= 40) {
    quantityScore = 90; // High value rescue batch
  } else if (qtyInKg > 40 && qtyInKg <= 100) {
    quantityScore = 82; // Requires vehicle / larger warehouse intake
  } else {
    quantityScore = 70; // Very large bulk batch requiring pallet handling
  }

  // 5. Distribution Ease Factor (0-100)
  const distributionEaseScore = foodType.distributionEase || 80;

  // 6. Destination Compatibility Factor (0-100)
  // Check how many destinations in the catalog can accept this food category/type
  const matchingDestinations = DESTINATIONS.filter(d => 
    d.acceptedFoodTypes.includes(foodType.id) || d.acceptedCategories.includes(foodType.category)
  );
  let destinationFitScore = 70;
  if (matchingDestinations.length >= 3) {
    destinationFitScore = 95;
  } else if (matchingDestinations.length === 2) {
    destinationFitScore = 88;
  } else if (matchingDestinations.length === 1) {
    destinationFitScore = 76;
  } else {
    destinationFitScore = 45;
  }

  // Calculate Weighted Sum
  const rawScore = 
    (conditionScore * RESCUE_SCORE_WEIGHTS.condition) +
    (urgencyScore * RESCUE_SCORE_WEIGHTS.urgency) +
    (quantityScore * RESCUE_SCORE_WEIGHTS.quantity) +
    (distributionEaseScore * RESCUE_SCORE_WEIGHTS.distributionEase) +
    (destinationFitScore * RESCUE_SCORE_WEIGHTS.destinationCompatibility);

  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Determine Priority Level
  let priority = PRIORITY_THRESHOLDS.low;
  if (finalScore >= PRIORITY_THRESHOLDS.high.min) {
    priority = PRIORITY_THRESHOLDS.high;
  } else if (finalScore >= PRIORITY_THRESHOLDS.medium.min) {
    priority = PRIORITY_THRESHOLDS.medium;
  }

  // Generate Explainable Rationale
  const rationale = generateScoreRationale({
    finalScore,
    priority,
    conditionScore,
    urgencyScore,
    destinationFitScore,
    timeObj,
    lang
  });

  return {
    score: finalScore,
    priority: priority.label,
    priorityMeta: priority,
    breakdown: {
      condition: {
        score: conditionScore,
        weight: RESCUE_SCORE_WEIGHTS.condition,
        contribution: Math.round(conditionScore * RESCUE_SCORE_WEIGHTS.condition * 10) / 10,
        label: lang === 'id' ? 'Kondisi Makanan' : 'Condition Integrity'
      },
      urgency: {
        score: urgencyScore,
        weight: RESCUE_SCORE_WEIGHTS.urgency,
        contribution: Math.round(urgencyScore * RESCUE_SCORE_WEIGHTS.urgency * 10) / 10,
        label: lang === 'id' ? 'Urgensi Waktu' : 'Rescue Urgency'
      },
      quantity: {
        score: quantityScore,
        weight: RESCUE_SCORE_WEIGHTS.quantity,
        contribution: Math.round(quantityScore * RESCUE_SCORE_WEIGHTS.quantity * 10) / 10,
        label: lang === 'id' ? 'Kelayakan Volume' : 'Volume Viability'
      },
      distributionEase: {
        score: distributionEaseScore,
        weight: RESCUE_SCORE_WEIGHTS.distributionEase,
        contribution: Math.round(distributionEaseScore * RESCUE_SCORE_WEIGHTS.distributionEase * 10) / 10,
        label: lang === 'id' ? 'Kemudahan Distribusi' : 'Distribution Ease'
      },
      destinationCompatibility: {
        score: destinationFitScore,
        weight: RESCUE_SCORE_WEIGHTS.destinationCompatibility,
        contribution: Math.round(destinationFitScore * RESCUE_SCORE_WEIGHTS.destinationCompatibility * 10) / 10,
        label: lang === 'id' ? 'Kecocokan Tujuan' : 'Destination Compatibility'
      }
    },
    rationale,
    timestamp: new Date().toISOString()
  };
}

function generateScoreRationale({
  finalScore,
  priority,
  conditionScore,
  urgencyScore,
  destinationFitScore,
  timeObj,
  lang = 'id'
}) {
  const points = [];

  if (lang === 'id') {
    if (conditionScore >= 85) {
      points.push('kondisi makanan dilaporkan sangat baik dan higienis untuk langsung disalurkan');
    } else if (conditionScore < 50) {
      points.push('kondisi makanan mendekati batas aman sehingga dialihkan ke daur ulang organik');
    }

    if (urgencyScore >= 88) {
      points.push('sisa waktu konsumsi mendesak, memerlukan penjemputan segera');
    } else {
      points.push('jendela pengiriman yang fleksibel memungkinkan perutean terencana');
    }

    if (destinationFitScore >= 85) {
      points.push('beberapa mitra komunitas yang cocok memiliki kapasitas penerimaan yang aktif');
    }

    if (points.length === 0) {
      points.push('parameter logistik standar terpenuhi');
    }

    const priorityLabel = priority?.min >= 80 ? 'PRIORITAS TINGGI' : (priority?.min >= 60 ? 'PRIORITAS SEDANG' : 'PRIORITAS RENDAH');
    const factorsJoined = points.join('; ');
    return `Surplus ini memperoleh Skor Penyelamatan ${finalScore}/100 (${priorityLabel}) karena: ${factorsJoined}.`;
  }

  // English fallback
  if (conditionScore >= 85) {
    points.push('reported condition is favorable and wholesome for rapid dispatch');
  } else if (conditionScore < 50) {
    points.push('reported condition is compromised and best directed toward bio-recovery');
  }

  if (urgencyScore >= 88) {
    points.push(`available rescue window is tight (${timeObj?.label || 'tight'}), prioritizing immediate transit`);
  } else {
    points.push('flexible dispatch window enables planned routing');
  }

  if (destinationFitScore >= 85) {
    points.push('multiple compatible community destinations currently have active intake capacity');
  }

  if (points.length === 0) {
    points.push('standard logistical parameters apply');
  }

  const factorsJoined = points.join('; ');
  return `This surplus achieved a ${finalScore}/100 Rescue Score (${priority.label}) because: ${factorsJoined}.`;
}
