import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { FOOD_TYPES, CONDITION_OPTIONS, TIME_WINDOWS, SOURCE_CONTEXTS } from '../data/foods';
import Button from '../components/Button';
import { TRANSLATIONS, getActiveLanguage } from '../utils/i18n';

export default function ReportSurplus({ onSubmitReport, lang = getActiveLanguage() }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.id;

  const [activePreset, setActivePreset] = useState('');
  const [userEditedNotes, setUserEditedNotes] = useState(false);

  const [formData, setFormData] = useState(() => ({
    foodTypeId: 'cooked-rice',
    quantity: '',
    unit: 'kg',
    conditionId: 'suitable',
    timeWindowId: '1_3h',
    sourceContextId: 'Catering',
    notes: ''
  }));

  const [errors, setErrors] = useState({});

  // Synchronize notes with language switch if user hasn't typed custom notes
  useEffect(() => {
    if (!userEditedNotes) {
      if (activePreset === 'rice') {
        setFormData(prev => ({ ...prev, notes: t.report.presetRiceNotes }));
      } else if (activePreset === 'veggies') {
        setFormData(prev => ({ ...prev, notes: t.report.presetVeggiesNotes }));
      } else if (activePreset === 'bread') {
        setFormData(prev => ({ ...prev, notes: t.report.presetBreadNotes }));
      } else {
        setFormData(prev => ({ ...prev, notes: t.report.defaultNotes }));
      }
    }
  }, [lang, activePreset, userEditedNotes, t]);

  const loadPreset = (presetKey, presetPayload) => {
    setActivePreset(presetKey);
    setUserEditedNotes(false);
    setFormData(presetPayload);
    setErrors({});
  };

  const validate = () => {
    const errs = {};
    if (!formData.foodTypeId) errs.foodTypeId = lang === 'id' ? 'Pilih jenis makanan' : 'Select a food type';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errs.quantity = lang === 'id' ? 'Masukkan jumlah yang valid' : 'Enter a valid quantity';
    }
    if (!formData.conditionId) errs.conditionId = lang === 'id' ? 'Pilih kondisi makanan' : 'Select food condition';
    if (!formData.timeWindowId) errs.timeWindowId = lang === 'id' ? 'Pilih sisa waktu aman' : 'Select time window';
    if (!formData.sourceContextId) errs.sourceContextId = lang === 'id' ? 'Pilih sumber makanan' : 'Select food source';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const selectedFood = FOOD_TYPES.find(f => f.id === formData.foodTypeId) || FOOD_TYPES[0];
    const selectedCondition = CONDITION_OPTIONS.find(c => c.id === formData.conditionId) || CONDITION_OPTIONS[0];
    const selectedTime = TIME_WINDOWS.find(t => t.id === formData.timeWindowId) || TIME_WINDOWS[0];

    const reportPayload = {
      foodTypeId: formData.foodTypeId,
      foodName: getFoodText(formData.foodTypeId).name || selectedFood.name,
      category: getFoodText(formData.foodTypeId).category || selectedFood.category,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      conditionId: formData.conditionId,
      conditionLabel: getConditionText(formData.conditionId).label || selectedCondition.label,
      timeWindowId: formData.timeWindowId,
      availableTimeLabel: getTimeWindowText(formData.timeWindowId) || selectedTime.label,
      sourceContextId: formData.sourceContextId,
      notes: formData.notes.trim()
    };

    if (onSubmitReport) {
      onSubmitReport(reportPayload);
    }
  };

  // Helper for translated food type
  const getFoodText = (foodId) => {
    return t.foodTypes?.[foodId] || { name: foodId, category: '' };
  };

  // Helper for translated condition
  const getConditionText = (condId) => {
    return t.conditions[condId] || { label: condId, desc: '' };
  };

  // Helper for translated time window
  const getTimeWindowText = (timeId) => {
    return t.timeWindows[timeId] || timeId;
  };

  // Helper for translated source context
  const getSourceText = (sourceId) => {
    return t.sourceContexts[sourceId] || sourceId;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Clean Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-5xl font-display font-black text-brand-900 tracking-tight">
          {t.report.title}
        </h1>
        <p className="text-sm font-sans font-semibold text-slate-600 max-w-xl mx-auto">
          {t.report.subtitle}
        </p>

        {/* Quick Demo Presets */}
        <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-display">
          <span className="text-slate-500 font-extrabold uppercase text-[11px] mr-1">
            {t.report.presetsLabel}
          </span>
          <button
            type="button"
            onClick={() => loadPreset('rice', {
              foodTypeId: 'cooked-rice',
              quantity: '8',
              unit: 'kg',
              conditionId: 'suitable',
              timeWindowId: '1_3h',
              sourceContextId: 'Catering',
              notes: t.report.presetRiceNotes
            })}
            className="px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold border border-amber-300 transition-all shadow-sm active:scale-95"
          >
            {t.report.presetRice}
          </button>
          <button
            type="button"
            onClick={() => loadPreset('veggies', {
              foodTypeId: 'fresh-vegetables',
              quantity: '4.2',
              unit: 'kg',
              conditionId: 'fresh_excellent',
              timeWindowId: '3_6h',
              sourceContextId: 'Restaurant',
              notes: t.report.presetVeggiesNotes
            })}
            className="px-3.5 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-extrabold border border-emerald-300 transition-all shadow-sm active:scale-95"
          >
            {t.report.presetVeggies}
          </button>
          <button
            type="button"
            onClick={() => loadPreset('bread', {
              foodTypeId: 'bread-pastries',
              quantity: '3',
              unit: 'kg',
              conditionId: 'near_window',
              timeWindowId: 'over_6h',
              sourceContextId: 'Retail',
              notes: t.report.presetBreadNotes
            })}
            className="px-3.5 py-1.5 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-950 font-extrabold border border-yellow-300 transition-all shadow-sm active:scale-95"
          >
            {t.report.presetBread}
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-card space-y-7">
        {/* Field 01: Food Type */}
        <div className="space-y-3">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f1} <span className="text-coral-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {FOOD_TYPES.map((type) => {
              const isSelected = formData.foodTypeId === type.id;
              const foodInfo = getFoodText(type.id);
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, foodTypeId: type.id })}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-brand-500 ring-2 ring-brand-400/30 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div>
                    <span className={`block text-xs font-display ${isSelected ? 'font-black text-brand-950' : 'font-extrabold text-slate-800'}`}>
                      {foodInfo.name}
                    </span>
                    <span className={`block text-[11px] font-sans capitalize mt-0.5 ${isSelected ? 'text-brand-700 font-bold' : 'text-slate-500'}`}>
                      {foodInfo.category}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {errors.foodTypeId && (
            <p className="text-xs text-coral-600 font-display font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.foodTypeId}
            </p>
          )}
        </div>

        {/* Field 02: Quantity & Unit */}
        <div className="space-y-3">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f2} <span className="text-coral-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                placeholder={t.report.qtyPlaceholder || (lang === 'id' ? 'Contoh: 8.0' : 'e.g. 8.0')}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-base font-display font-extrabold focus:outline-none focus:border-brand-500 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, unit: 'kg' })}
                className={`px-5 py-3 rounded-2xl text-xs font-display font-extrabold uppercase border-2 transition-all flex items-center gap-1.5 ${
                  formData.unit === 'kg'
                    ? 'bg-teal-50 border-brand-500 text-brand-950 ring-2 ring-brand-400/30 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{t.report.unitKg}</span>
                {formData.unit === 'kg' && <span className="text-brand-600 font-bold">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, unit: 'portions' })}
                className={`px-5 py-3 rounded-2xl text-xs font-display font-extrabold uppercase border-2 transition-all flex items-center gap-1.5 ${
                  formData.unit === 'portions'
                    ? 'bg-teal-50 border-brand-500 text-brand-950 ring-2 ring-brand-400/30 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{t.report.unitPortions}</span>
                {formData.unit === 'portions' && <span className="text-brand-600 font-bold">✓</span>}
              </button>
            </div>
          </div>
          {errors.quantity && (
            <p className="text-xs text-coral-600 font-display font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.quantity}
            </p>
          )}
        </div>

        {/* Field 03: Condition */}
        <div className="space-y-3">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f3} <span className="text-coral-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CONDITION_OPTIONS.map((cond) => {
              const isSelected = formData.conditionId === cond.id;
              const condText = getConditionText(cond.id);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, conditionId: cond.id })}
                  className={`p-4 rounded-2xl text-left border-2 transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-brand-500 ring-2 ring-brand-400/30 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-display text-sm ${isSelected ? 'font-black text-brand-950' : 'font-extrabold text-slate-800'}`}>
                      {condText.label}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed font-sans ${isSelected ? 'text-brand-800 font-semibold' : 'text-slate-500'}`}>
                    {condText.desc}
                  </p>
                </button>
              );
            })}
          </div>
          {errors.conditionId && (
            <p className="text-xs text-coral-600 font-display font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.conditionId}
            </p>
          )}
        </div>

        {/* Field 04: Available Time Window */}
        <div className="space-y-3">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f4} <span className="text-coral-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TIME_WINDOWS.map((time) => {
              const isSelected = formData.timeWindowId === time.id;
              const timeLabel = getTimeWindowText(time.id);
              return (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, timeWindowId: time.id })}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-brand-500 ring-2 ring-brand-400/30 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={`text-xs font-display ${isSelected ? 'font-black text-brand-950' : 'font-extrabold text-slate-800'}`}>
                    {timeLabel}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {errors.timeWindowId && (
            <p className="text-xs text-coral-600 font-display font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.timeWindowId}
            </p>
          )}
        </div>

        {/* Field 05: Source Context */}
        <div className="space-y-3">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f5} <span className="text-coral-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SOURCE_CONTEXTS.map((src) => {
              const isSelected = formData.sourceContextId === src.id;
              const srcLabel = getSourceText(src.id);
              return (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, sourceContextId: src.id })}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-brand-500 ring-2 ring-brand-400/30 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className={`text-xs font-display ${isSelected ? 'font-black text-brand-950' : 'font-extrabold text-slate-800'}`}>
                    {srcLabel}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {errors.sourceContextId && (
            <p className="text-xs text-coral-600 font-display font-bold flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.sourceContextId}
            </p>
          )}
        </div>

        {/* Field 06: Handling Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-display font-extrabold uppercase tracking-wider text-slate-800">
            {t.report.f6}
          </label>
          <textarea
            rows="2"
            value={formData.notes}
            onChange={(e) => {
              setUserEditedNotes(true);
              setFormData({ ...formData, notes: e.target.value });
            }}
            placeholder={t.report.f6Placeholder}
            className="w-full p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-900 text-xs font-sans focus:outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>

        {/* Form Submission CTA */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            variant="sun"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            className="w-full sm:w-auto text-sm px-8 py-3.5 shadow-sun font-display font-black"
          >
            {t.report.submitBtn}
          </Button>
        </div>
      </form>
    </div>
  );
}
