import React, { useState } from 'react';
import { simulateSurplusReduction } from '../utils/calculations';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function PreventionSimulator({ lang = getActiveLanguage() }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;
  const [plannedServings, setPlannedServings] = useState(120);
  const [surplusPercent, setSurplusPercent] = useState(15);

  const simulation = simulateSurplusReduction(plannedServings, surplusPercent);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-100">
        <h3 className="text-2xl sm:text-3xl font-display font-black text-brand-900">
          {t.insights.simCardTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl font-sans font-semibold">
          {lang === 'id'
            ? 'Simulasikan bagaimana kalibrasi buffer kelebihan produksi dan persiapan bertahap dapat mencegah timbulnya surplus sebelum makanan perlu diselamatkan.'
            : 'Simulate how recalibrating safety buffers and adopting progressive shift batching can eliminate upstream surplus before rescue is required.'}
        </p>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-b border-slate-100">
        <div className="bg-sky-50/60 p-5 rounded-2xl border border-sky-100">
          <label className="block text-xs font-display font-extrabold uppercase text-slate-800 mb-2">
            {t.insights.plannedLabel} <span className="font-black text-brand-700 text-sm">{plannedServings}</span>
          </label>
          <input
            type="range"
            min="20"
            max="500"
            step="10"
            value={plannedServings}
            onChange={(e) => setPlannedServings(Number(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-2.5 bg-white rounded-full"
          />
          <div className="flex justify-between text-[11px] font-display font-bold text-slate-500 mt-2">
            <span>20 (Bistro)</span>
            <span>250 (Banquet)</span>
            <span>500 (Event)</span>
          </div>
        </div>

        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-100">
          <label className="block text-xs font-display font-extrabold uppercase text-slate-800 mb-2">
            {t.insights.bufferLabel} <span className="font-black text-amber-700 text-sm">{surplusPercent}%</span>
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={surplusPercent}
            onChange={(e) => setSurplusPercent(Number(e.target.value))}
            className="w-full accent-sun-500 cursor-pointer h-2.5 bg-white rounded-full"
          />
          <div className="flex justify-between text-[11px] font-display font-bold text-slate-500 mt-2">
            <span>5% (Strict)</span>
            <span>15% (Typical)</span>
            <span>30% (High Buffer)</span>
          </div>
        </div>
      </div>

      {/* Baseline Status vs Results */}
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-display font-extrabold uppercase text-slate-600 block">
              {lang === 'id' ? 'Kelebihan Makanan Sebelum Efisiensi:' : 'Baseline Unserved Food:'}
            </span>
            <span className="text-xl font-display font-black text-brand-900">
              {simulation.currentSurplusServings} {lang === 'id' ? 'porsi' : 'portions'}
            </span>
            <span className="text-xs font-sans font-bold text-slate-500 ml-2">
              (≈ {simulation.estimatedWasteKg} kg / event)
            </span>
          </div>
        </div>

        {/* 3 Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 block">
              {lang === 'id' ? 'Pengurangan Buffer (-25%)' : 'Buffer Trim (-25%)'}
            </span>
            <div>
              <span className="text-3xl font-display font-black text-brand-700">
                {simulation?.scenarios?.conservative?.servingsPrevented ?? 0}
              </span>
              <span className="text-xs font-display font-bold text-slate-500 ml-1.5">
                {lang === 'id' ? 'porsi dicegah' : 'portions saved'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              ≈ {simulation?.scenarios?.conservative?.wasteAvoidedKg ?? simulation?.scenarios?.conservative?.kgPrevented ?? 0} kg {lang === 'id' ? 'makanan terselamatkan' : 'waste avoided'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-brand-400 shadow-card space-y-2">
            <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-brand-600 block">
              {lang === 'id' ? 'Persiapan 2 Tahap (-50%)' : 'Shift Batching (-50%)'}
            </span>
            <div>
              <span className="text-3xl font-display font-black text-brand-600">
                {simulation?.scenarios?.moderate?.servingsPrevented ?? 0}
              </span>
              <span className="text-xs font-display font-bold text-slate-500 ml-1.5">
                {lang === 'id' ? 'porsi dicegah' : 'portions saved'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-sans font-semibold">
              ≈ {simulation?.scenarios?.moderate?.wasteAvoidedKg ?? simulation?.scenarios?.moderate?.kgPrevented ?? 0} kg {lang === 'id' ? 'makanan terselamatkan' : 'waste avoided'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
            <span className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-500 block">
              {lang === 'id' ? 'Produksi Sesuai Pesanan (-75%)' : 'Cook-to-Order Par (-75%)'}
            </span>
            <div>
              <span className="text-3xl font-display font-black text-brand-700">
                {simulation?.scenarios?.progressive?.servingsPrevented ?? simulation?.scenarios?.aggressive?.servingsPrevented ?? 0}
              </span>
              <span className="text-xs font-display font-bold text-slate-500 ml-1.5">
                {lang === 'id' ? 'porsi dicegah' : 'portions saved'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              ≈ {simulation?.scenarios?.progressive?.wasteAvoidedKg ?? simulation?.scenarios?.progressive?.kgPrevented ?? 0} kg {lang === 'id' ? 'makanan terselamatkan' : 'waste avoided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
