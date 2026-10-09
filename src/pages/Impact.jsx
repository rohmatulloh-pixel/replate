import React, { useState, useEffect } from 'react';
import { getReports, loadDemoData } from '../utils/storage';
import { calculateImpactSummary } from '../utils/calculations';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function Impact({ onNavigate, lang = getActiveLanguage() }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;
  const [reports, setReports] = useState(() => getReports());

  useEffect(() => {
    const handleUpdate = () => setReports(getReports());
    window.addEventListener('replate:storage-update', handleUpdate);
    return () => window.removeEventListener('replate:storage-update', handleUpdate);
  }, []);

  const impact = calculateImpactSummary(reports);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-200/60">
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-brand-900 tracking-tight">
            {t.impact.title}
          </h1>
          <p className="text-xs sm:text-sm font-sans font-semibold text-slate-600 mt-1">
            {t.impact.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="sun"
            size="sm"
            onClick={() => onNavigate('report')}
            className="text-xs px-5 py-2.5 shadow-sun font-display font-extrabold"
          >
            {t.nav.reportButton} ✨
          </Button>
        </div>
      </div>

      {/* Check for empty state */}
      {reports.length === 0 ? (
        <EmptyState
          title={t.journey.emptyTitle}
          description={t.journey.emptyDesc}
          actionLabel={t.nav.reportButton}
          onAction={() => onNavigate('report')}
          onLoadDemo={() => {
            loadDemoData();
            setReports(getReports());
          }}
        />
      ) : (
        <>
          {/* Main Hero Metrics Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Total Kilograms */}
            <div className="md:col-span-5 bg-gradient-to-tr from-brand-600 via-teal-600 to-sky-600 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-card relative overflow-hidden">
              <div className="absolute top-4 right-4 text-4xl opacity-20 select-none">🍲</div>

              <div>
                <span className="block text-xs font-display font-black uppercase tracking-widest text-teal-100 mb-2">
                  {lang === 'id' ? 'Total Pangan Terselamatkan' : 'Cumulative Food Diverted'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl sm:text-7xl font-display font-black tracking-tight text-white">
                    {impact.totalRescuedKg}
                  </span>
                  <span className="text-2xl font-display font-bold text-sun-300">
                    KG
                  </span>
                </div>
                <span className="block text-xs font-display font-bold uppercase tracking-wider text-teal-100 mt-1">
                  {lang === 'id' ? 'Telah Diterima & Diselamatkan' : 'Rescued & Received'}
                </span>
              </div>

              <div className="pt-6 border-t border-teal-500/50 text-xs font-display text-teal-100 flex justify-between">
                <span>{lang === 'id' ? 'Dalam Pengantaran' : 'In Transit'}: {impact.totalActiveKg} kg</span>
                <span>{lang === 'id' ? 'Selesai' : 'Completed'}: {impact.completedJourneys}</span>
              </div>
            </div>

            {/* Supporting Hero Metrics Grid */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Estimated Servings */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🍽️</span>
                    <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
                      {lang === 'id' ? 'Nutrisi Komunitas' : 'Community Nutrition'}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-display font-black text-brand-900">
                    {impact.estimatedServings}
                  </div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider text-brand-600 mt-1">
                    {t.impact.servings}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-500 pt-3 border-t border-slate-100">
                  {lang === 'id' ? 'Standar 0.35 kg/porsi (GFN / WFP)' : 'Standard 0.35 kg/portion (GFN / WFP)'}
                </p>
              </div>

              {/* CO2e Avoidance */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌿</span>
                    <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
                      {lang === 'id' ? 'Emisi Dicegah' : 'Emissions Abated'}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-display font-black text-emerald-800">
                    {impact.estimatedCo2eAvoidedKg}
                  </div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider text-emerald-800 mt-1">
                    {t.impact.co2}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-500 pt-3 border-t border-slate-100">
                  {lang === 'id' ? 'Penekanan metana TPA (US EPA WARM)' : 'Landfill methane suppression (US EPA WARM)'}
                </p>
              </div>

              {/* Embodied Water */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💧</span>
                    <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
                      {lang === 'id' ? 'Air Dihemat' : 'Water Saved'}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-display font-black text-sky-800">
                    {impact.estimatedWaterSavedLiters.toLocaleString()}
                  </div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider text-sky-800 mt-1">
                    {t.impact.water}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-500 pt-3 border-t border-slate-100">
                  {lang === 'id' ? 'Air irigasi pertanian dihemat (FAO Footprint)' : 'Agricultural water saved (FAO Footprint)'}
                </p>
              </div>

              {/* Successful Intake Matches */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-500">
                      {lang === 'id' ? 'Efisiensi Logistik' : 'Logistics Efficiency'}
                    </span>
                  </div>
                  <div className="text-4xl sm:text-5xl font-display font-black text-brand-900">
                    {impact.successfulMatches}
                  </div>
                  <span className="block text-xs font-display font-bold uppercase tracking-wider text-brand-600 mt-1">
                    {lang === 'id' ? 'Pencocokan Sukses' : 'Successful Matches'}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-slate-500 pt-3 border-t border-slate-100">
                  {lang === 'id' ? 'Terhubung dengan mitra nirlaba terverifikasi' : 'Connected to verified regional non-profit hubs'}
                </p>
              </div>
            </div>
          </div>

          {/* Allocation Breakdowns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            {/* Route Distribution Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
              <h3 className="text-xl font-display font-black text-brand-900">
                {lang === 'id' ? 'Rute Penanganan yang Dijalankan' : 'Rescue Routes Executed'}
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  { label: lang === 'id' ? 'Distribusi Langsung (Konsumsi Manusia)' : 'Direct Redistribution (Human Nutrition)', key: 'REDISTRIBUTE', color: 'bg-brand-500' },
                  { label: lang === 'id' ? 'Pengolahan Kuliner Sekunder' : 'Secondary Culinary Processing', key: 'PROCESS', color: 'bg-sun-500' },
                  { label: lang === 'id' ? 'Pengomposan / Daur Ulang Organik' : 'Organic Composting / Bio-Hub', key: 'ORGANIC', color: 'bg-lime-500' }
                ].map(({ label, key, color }) => {
                  const count = impact.routeDistribution[key] || 0;
                  const total = impact.totalReports || 1;
                  const pct = Math.round((count / total) * 100);

                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-display font-bold">
                        <span className="text-slate-700">{label}</span>
                        <span className="text-slate-600">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Allocation Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-card space-y-4">
              <h3 className="text-xl font-display font-black text-brand-900">
                {lang === 'id' ? 'Volume Berdasarkan Mitra Penerima' : 'Volume Delivered by Destination'}
              </h3>

              <div className="space-y-3 pt-2">
                {Object.keys(impact.destinationDistribution).length === 0 ? (
                  <p className="text-xs font-display text-slate-400">
                    {lang === 'id' ? 'Belum ada pengiriman yang tercatat.' : 'No destination deliveries logged yet.'}
                  </p>
                ) : (
                  Object.entries(impact.destinationDistribution).map(([destName, kg]) => {
                    const total = impact.totalHandledKg || 1;
                    const pct = Math.round((kg / total) * 100);

                    return (
                      <div key={destName} className="space-y-1">
                        <div className="flex justify-between text-xs font-display font-bold">
                          <span className="text-slate-700 truncate pr-2">{destName}</span>
                          <span className="text-brand-900">{kg.toFixed(1)} kg</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
