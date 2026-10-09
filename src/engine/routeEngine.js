/**
 * REPLATE Route Engine
 * Deterministic, rule-based decision engine to assign the most appropriate route:
 * - REDISTRIBUTE (Direct human nourishment)
 * - PROCESS (Culinary transformation & upcycling)
 * - ORGANIC (Composting & biological energy recovery)
 */

import { ROUTES } from '../data/rules.js';
import { FOOD_TYPES } from '../data/foods.js';
import { getFoodDisplayName } from '../utils/calculations.js';

const ROUTE_META_ID = {
  REDISTRIBUTE: {
    id: 'REDISTRIBUTE',
    title: 'Distribusi Langsung',
    tagline: 'Surplus pangan bernutrisi langsung disalurkan ke program santap komunitas.',
    badgeColor: 'bg-forest-900 text-ivory-50',
    description: 'Cocok untuk makanan dalam kondisi segar/layak yang dapat dikonsumsi dalam batas waktu amannya.'
  },
  PROCESS: {
    id: 'PROCESS',
    title: 'Pengolahan Kuliner Sekunder & Daur Ulang',
    tagline: 'Transformasi kuliner menjadi saus tahan lama, sup, kaldu, atau makanan olahan.',
    badgeColor: 'bg-sage-500 text-ivory-50',
    description: 'Berlaku untuk bahan makanan sehat yang membutuhkan pengolahan dapur, pemanggangan, atau pengawetan sebelum digunakan.'
  },
  ORGANIC: {
    id: 'ORGANIC',
    title: 'Daur Ulang Kompos & Bio-Energi',
    tagline: 'Pengalihan biologis menjadi kompos organik atau pemulihan energi hayati.',
    badgeColor: 'bg-charcoal-800 text-ivory-50',
    description: 'Diperuntukkan bagi sisa makanan yang tidak lagi layak dikonsumsi manusia untuk mencegah timbulan metana di TPA.'
  }
};

export function determineRoute({
  foodTypeId,
  conditionId,
  timeWindowId
}, lang = 'id') {
  const foodType = FOOD_TYPES.find(f => f.id === foodTypeId) || FOOD_TYPES[FOOD_TYPES.length - 1];
  const fName = getFoodDisplayName(foodType.id, foodType.name, lang);

  let selectedRoute = ROUTES.REDISTRIBUTE;
  const whyPoints = [];

  // Deterministic Safety Gate 1: If condition is Not Suitable for direct consumption
  if (conditionId === 'not_suitable') {
    selectedRoute = ROUTES.ORGANIC;
    if (lang === 'id') {
      whyPoints.push('Kondisi makanan telah melewati standar kelayakan konsumsi langsung.');
      whyPoints.push('Pengalihan ke pengomposan aerobik atau bio-energi mencegah pembentukan gas metana TPA.');
      whyPoints.push('Menjaga kesehatan komunitas dengan menerapkan protokol keamanan pangan yang ketat.');
    } else {
      whyPoints.push('Reported condition is past direct edible redistribution standards.');
      whyPoints.push('Directing to aerobic composting or bio-energy avoids landfill methane generation.');
      whyPoints.push('Protects recipient community health by observing strict food safety protocols.');
    }
    
    const meta = lang === 'id' ? ROUTE_META_ID.ORGANIC : selectedRoute;
    return {
      route: selectedRoute.id,
      routeMeta: meta,
      why: whyPoints,
      safetyNotice: lang === 'id'
        ? 'Bahan ditandai untuk pemulihan organik. Tidak untuk dikonsumsi manusia.'
        : 'Material flagged for organic recovery. Do not offer for human consumption.'
    };
  }

  // Deterministic Rule 2: Near end of usable window + perishable produce / bakery
  if (conditionId === 'near_window') {
    if (foodType.category === 'produce' || foodType.category === 'bakery') {
      selectedRoute = ROUTES.PROCESS;
      if (lang === 'id') {
        whyPoints.push(`Kategori bahan pangan (${fName}) sangat ideal untuk transformasi kuliner.`);
        whyPoints.push('Pengolahan ulang menjadi kaldu, puree, saus, atau crouton memperpanjang masa simpan 3–14 hari.');
        whyPoints.push('Menghindari kendala batas waktu mendesak dari pengiriman makanan siap santap langsung.');
      } else {
        whyPoints.push(`Ingredient category (${foodType.name}) is prime for culinary transformation.`);
        whyPoints.push('Upcycling into broths, purées, sauces, or croutons extends shelf-life by 3–14 days.');
        whyPoints.push('Avoids urgency bottleneck of direct hot-meal transport.');
      }
    } else {
      // Prepared food near end of window with very tight time
      if (timeWindowId === 'under_1h') {
        selectedRoute = ROUTES.REDISTRIBUTE;
        if (lang === 'id') {
          whyPoints.push('Batas waktu sangat mendesak: langsung kirim ke dapur umum terdekat sebelum waktu aman berakhir.');
          whyPoints.push('Makanan dilaporkan masih layak konsumsi jika disajikan dengan segera.');
        } else {
          whyPoints.push('Critical immediate window: direct drop-off at nearest soup kitchen before window lapses.');
          whyPoints.push('Food is still reported as suitable for consumption if served promptly.');
        }
      } else {
        selectedRoute = ROUTES.PROCESS;
        if (lang === 'id') {
          whyPoints.push('Pengolahan sekunder direkomendasikan untuk mengawetkan surplus makanan sebelum batas waktu konsumsi berakhir.');
        } else {
          whyPoints.push('Secondary processing recommended to safely preserve surplus before serving window expires.');
        }
      }
    }
  } else {
    // Deterministic Rule 3: Fresh or wholesome condition -> Direct REDISTRIBUTE
    selectedRoute = ROUTES.REDISTRIBUTE;
    if (lang === 'id') {
      whyPoints.push('Kondisi makanan dilaporkan segar dan memenuhi kriteria konsumsi langsung.');
      whyPoints.push('Kemanfaatan sosial tinggi: menyediakan asupan nutrisi langsung untuk program santap bersama masyarakat.');
      whyPoints.push('Dapur umum dan rumah singgah lokal memiliki kapasitas penerimaan aktif untuk kategori ini.');
      if (timeWindowId === 'under_1h' || timeWindowId === '1_3h') {
        whyPoints.push('Urgensi waktu tinggi memerlukan pengantaran segera ke mitra berjarak terdekat.');
      }
    } else {
      whyPoints.push('Reported condition is wholesome and meets direct consumption criteria.');
      whyPoints.push('High community utility: provides immediate nourishment for community meal programs.');
      whyPoints.push('Active local community kitchens and shelters have intake demand for this category.');
      if (timeWindowId === 'under_1h' || timeWindowId === '1_3h') {
        whyPoints.push('High time urgency requires immediate dispatch to near-proximity partners.');
      }
    }
  }

  const meta = lang === 'id' ? ROUTE_META_ID[selectedRoute.id] : selectedRoute;

  return {
    route: selectedRoute.id,
    routeMeta: meta,
    why: whyPoints,
    safetyNotice: lang === 'id'
      ? 'Hanya rekomendasi pendukung keputusan. Penerima wajib memverifikasi suhu fisik dan kondisi organoleptik saat serah terima.'
      : 'Decision support recommendation only. Receiver must verify physical temperature and organoleptic properties upon receipt.'
  };
}
