import React from 'react';
import { PriorityBadge } from './StatusBadge';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function ScoreBreakdown({ score, priority, breakdown, rationale, lang = getActiveLanguage() }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

  if (!breakdown) return null;

  const items = [
    { key: 'condition', label: lang === 'id' ? 'Kondisi Makanan' : 'Food Condition', weight: '30%', data: breakdown.condition, color: 'from-emerald-400 to-teal-500' },
    { key: 'urgency', label: lang === 'id' ? 'Urgensi Waktu' : 'Time Urgency', weight: '25%', data: breakdown.urgency, color: 'from-amber-400 to-orange-500' },
    { key: 'quantity', label: lang === 'id' ? 'Kelayakan Volume' : 'Volume Viability', weight: '15%', data: breakdown.quantity, color: 'from-sky-400 to-blue-500' },
    { key: 'distributionEase', label: lang === 'id' ? 'Kemudahan Distribusi' : 'Distribution Ease', weight: '15%', data: breakdown.distributionEase, color: 'from-teal-400 to-emerald-500' },
    { key: 'destinationCompatibility', label: lang === 'id' ? 'Kecocokan Tujuan' : 'Destination Fit', weight: '15%', data: breakdown.destinationCompatibility, color: 'from-purple-400 to-indigo-500' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-card space-y-6">
      {/* Header Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="block text-xs font-display font-black uppercase tracking-wider text-slate-400 mb-1">
            ⚡ {t.assessment.rescueScore}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-display font-black text-brand-900 tracking-tight">
              {score}
            </span>
            <span className="text-2xl font-display font-bold text-slate-400">
              / 100
            </span>
          </div>
        </div>

        <div>
          <PriorityBadge priority={priority} className="text-sm px-4 py-1.5" lang={lang} />
        </div>
      </div>

      {/* Factor Breakdown Bars */}
      <div className="space-y-4">
        <div className="flex justify-between text-xs font-display font-extrabold text-slate-500 uppercase tracking-wider">
          <span>{lang === 'id' ? 'Kriteria Penilaian' : 'Weighted Criteria'}</span>
          <span>{lang === 'id' ? 'Skor & Bobot' : 'Score & Weight'}</span>
        </div>

        {items.map(({ key, label, weight, data, color }) => {
          const val = data?.score || 0;
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-display font-extrabold text-slate-800">{label}</span>
                <div className="flex items-center gap-2 font-display text-xs">
                  <span className="text-slate-500">[{weight}]</span>
                  <span className="font-black text-brand-900 w-8 text-right">{val}</span>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Rationale Box */}
      {rationale && (
        <div className="pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs sm:text-sm font-sans font-semibold text-slate-700 leading-relaxed italic">
            "{rationale}"
          </div>
        </div>
      )}
    </div>
  );
}
