import React from 'react';
import { Check, MapPin, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import Button from './Button';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function MatchCard({
  match,
  isBestMatch = false,
  onSelect,
  selected = false,
  lang = getActiveLanguage()
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;
  const { destination, matchScore, checklist, rationale } = match;

  return (
    <div
      className={`rounded-3xl border-2 transition-all duration-200 p-6 md:p-8 relative ${
        isBestMatch
          ? 'bg-gradient-to-b from-white via-teal-50/25 to-white border-brand-400 shadow-card'
          : selected
            ? 'bg-teal-50/50 border-brand-500 shadow-card'
            : 'bg-white border-slate-100 shadow-soft hover:shadow-card'
      }`}
    >
      {/* Best Match Pill */}
      {isBestMatch && (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sun-400 text-amber-950 font-display font-extrabold text-xs shadow-sm mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.assessment.bestMatch}</span>
        </div>
      )}

      {/* Header Info & Match Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs font-display font-extrabold uppercase text-brand-600 tracking-wider block mb-1">
            {destination.type}
          </span>

          <h3 className="text-2xl font-display font-black text-brand-900">
            {destination.name}
          </h3>

          <p className="text-xs text-slate-600 mt-1 max-w-xl font-sans font-semibold">
            {destination.description}
          </p>
        </div>

        {/* Match Percentage Pill */}
        <div className="sm:text-right shrink-0">
          <div className="inline-block bg-teal-50 border-2 border-brand-300 rounded-2xl px-4 py-2 shadow-sm text-center">
            <span className="block text-3xl font-display font-black text-brand-600">
              {matchScore}%
            </span>
            <span className="block text-[10px] font-display font-extrabold uppercase tracking-wider text-slate-600">
              {t.assessment.compatibility}
            </span>
          </div>
        </div>
      </div>

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 text-xs font-display text-slate-700 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{destination.demoDistanceKm} km {lang === 'id' ? 'jarak estimasi' : 'estimated distance'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{destination.operatingWindow}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
          <span>{destination.currentAvailableCapacityKg} kg {lang === 'id' ? 'kapasitas tersedia' : 'capacity available'}</span>
        </div>
      </div>

      {/* Criteria Verification Checklist */}
      <div className="py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs p-3 rounded-2xl border ${
                item.passed
                  ? 'bg-emerald-50/70 border-emerald-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                item.passed ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
                <Check className="w-3.5 h-3.5 font-bold" />
              </span>
              <div>
                <span className="font-display font-extrabold text-slate-900 block">{item.label}</span>
                <span className="text-[11px] text-slate-600 font-sans">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-sans italic">
          {rationale?.[0] || (lang === 'id' ? 'Parameter kecocokan terverifikasi.' : 'Optimized matching verified.')}
        </span>
        <Button
          variant={selected ? 'primary' : isBestMatch ? 'sun' : 'secondary'}
          size="md"
          onClick={() => onSelect && onSelect(destination, matchScore)}
          className="w-full sm:w-auto font-display font-black text-xs px-6 py-3"
          icon={selected ? Check : ArrowRight}
          iconPosition="right"
        >
          {selected ? t.assessment.selectedDestination : t.assessment.selectDestination}
        </Button>
      </div>
    </div>
  );
}
