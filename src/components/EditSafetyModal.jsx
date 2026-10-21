import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Thermometer, 
  Box, 
  Clock,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  FOOD_TYPES,
  SAFETY_CONDITION_OPTIONS, 
  SAFETY_STORAGE_HISTORY_OPTIONS, 
  SAFETY_TEMP_OPTIONS, 
  SAFETY_PACKAGING_OPTIONS, 
  SAFETY_HANDLING_OPTIONS,
  TIME_WINDOWS 
} from '../data/foods';
import Button from './Button';

export default function EditSafetyModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  lang = 'id'
}) {
  const isId = lang === 'id';

  const [formData, setFormData] = useState(() => ({
    foodTypeId: initialData?.foodTypeId || 'cooked-rice',
    safetyConditionId: initialData?.safetyConditionId || 'no_visible_damage',
    storageHistoryId: initialData?.storageHistoryId || 'known_compliant',
    storageTempId: initialData?.storageTempId || 'hot_holding_above_60',
    packagingConditionId: initialData?.packagingConditionId || 'intact_proper',
    handlingIntegrityId: initialData?.handlingIntegrityId || 'hygienic_separated',
    timeWindowId: initialData?.timeWindowId || '1_3h',
    storageDurationHours: initialData?.storageDurationHours ?? '1.5',
    expiryDate: initialData?.expiryDate || '',
    preparedAt: initialData?.preparedAt || ''
  }));

  // Re-sync when initialData changes or modal opens
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        foodTypeId: initialData.foodTypeId || 'cooked-rice',
        safetyConditionId: initialData.safetyConditionId || 'no_visible_damage',
        storageHistoryId: initialData.storageHistoryId || 'known_compliant',
        storageTempId: initialData.storageTempId || 'hot_holding_above_60',
        packagingConditionId: initialData.packagingConditionId || 'intact_proper',
        handlingIntegrityId: initialData.handlingIntegrityId || 'hygienic_separated',
        timeWindowId: initialData.timeWindowId || '1_3h',
        storageDurationHours: initialData.storageDurationHours ?? '1.5',
        expiryDate: initialData.expiryDate || '',
        preparedAt: initialData.preparedAt || ''
      });
    }
  }, [initialData, isOpen]);

  // Lock background scroll & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApply = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...formData,
        storageDurationHours: formData.storageDurationHours !== '' ? String(formData.storageDurationHours) : '0'
      });
    }
    onClose();
  };

  const getCategoryLabel = (catId) => {
    switch (catId) {
      case 'prepared': return isId ? 'Matang / Siap Santap' : 'Prepared Meal';
      case 'bakery': return isId ? 'Roti & Kudapan' : 'Bakery & Grains';
      case 'produce': return isId ? 'Bahan Segar' : 'Fresh Produce';
      case 'packaged': return isId ? 'Kemasan Kering' : 'Packaged';
      case 'dairy': return isId ? 'Susu & Olahan Dingin' : 'Dairy & Chilled';
      case 'meat_fish': return isId ? 'Daging / Ikan' : 'Meat & Fish';
      default: return catId;
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div 
        className="bg-white rounded-3xl border border-slate-100 max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-safety-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed & High-Contrast */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 id="edit-safety-title" className="text-base sm:text-lg font-display font-black text-brand-900 leading-tight">
                {isId ? 'Perbarui Parameter Keamanan Pangan' : 'Update Food Safety Parameters'}
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-tight mt-0.5">
                {isId 
                  ? 'Lengkapi atau sesuaikan parameter di bawah untuk evaluasi ulang Food Safety Gate secara instan.' 
                  : 'Adjust inspection parameters to trigger instant Food Safety Gate re-evaluation.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
            aria-label={isId ? 'Tutup modal' : 'Close modal'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="edit-safety-form" onSubmit={handleApply} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Informational Guidance Box */}
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-100 text-xs font-sans text-sky-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isId
                ? 'Standar WHO & Kemenkes RI: Pangan matang aman pada suhu >60°C (panas) atau <4°C (dingin). Penyimpanan di suhu ruang (zona bahaya 5–60°C) wajib dibatasi maksimal 2–4 jam.'
                : 'WHO & Health Standard: Prepared foods require >60°C (hot) or <4°C (chilled). Ambient holding inside the danger zone (5–60°C) must not exceed 2–4 hours.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Parameter 1: Food Type & Category */}
            <div className="space-y-1.5">
              <label htmlFor="edit-food-type" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '01. Kategori & Karakteristik Pangan:' : '01. Food Category & Stream:'}
              </label>
              <select
                id="edit-food-type"
                value={formData.foodTypeId}
                onChange={(e) => setFormData({ ...formData, foodTypeId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {FOOD_TYPES.map((ft) => (
                  <option key={ft.id} value={ft.id}>
                    {ft.name} ({getCategoryLabel(ft.category)})
                  </option>
                ))}
              </select>
            </div>

            {/* Parameter 2: Condition */}
            <div className="space-y-1.5">
              <label htmlFor="edit-safety-condition" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '02. Kondisi Fisik & Sensoris:' : '02. Physical & Sensory Condition:'}
              </label>
              <select
                id="edit-safety-condition"
                value={formData.safetyConditionId}
                onChange={(e) => setFormData({ ...formData, safetyConditionId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {SAFETY_CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Parameter 3: Storage History */}
            <div className="space-y-1.5">
              <label htmlFor="edit-storage-history" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '03. Riwayat Penyimpanan:' : '03. Storage History:'}
              </label>
              <select
                id="edit-storage-history"
                value={formData.storageHistoryId}
                onChange={(e) => setFormData({ ...formData, storageHistoryId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {SAFETY_STORAGE_HISTORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Parameter 4: Storage Temperature Holding */}
            <div className="space-y-1.5">
              <label htmlFor="edit-storage-temp" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '04. Suhu Penyimpanan Aktual:' : '04. Actual Holding Temperature:'}
              </label>
              <select
                id="edit-storage-temp"
                value={formData.storageTempId}
                onChange={(e) => setFormData({ ...formData, storageTempId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {SAFETY_TEMP_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Parameter 5: Packaging */}
            <div className="space-y-1.5">
              <label htmlFor="edit-packaging-condition" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '05. Integritas Kemasan:' : '05. Packaging Integrity:'}
              </label>
              <select
                id="edit-packaging-condition"
                value={formData.packagingConditionId}
                onChange={(e) => setFormData({ ...formData, packagingConditionId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {SAFETY_PACKAGING_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Parameter 6: Handling & Hygiene */}
            <div className="space-y-1.5">
              <label htmlFor="edit-handling-integrity" className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                {isId ? '06. Higiene Penanganan & Pemisahan:' : '06. Handling Hygiene & Separation:'}
              </label>
              <select
                id="edit-handling-integrity"
                value={formData.handlingIntegrityId}
                onChange={(e) => setFormData({ ...formData, handlingIntegrityId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-display font-bold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {SAFETY_HANDLING_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isId ? opt.labelId : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Holding Duration */}
            <div className="space-y-1.5">
              <label htmlFor="edit-storage-duration" className="block text-xs font-display font-bold text-slate-700">
                {isId ? 'Lama Penyimpanan (Jam):' : 'Holding Duration (Hours):'}
              </label>
              <input
                id="edit-storage-duration"
                type="number"
                step="0.5"
                min="0"
                value={formData.storageDurationHours}
                onChange={(e) => setFormData({ ...formData, storageDurationHours: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
                placeholder="Contoh: 1.5"
              />
            </div>

            {/* Safe Time Window */}
            <div className="space-y-1.5">
              <label htmlFor="edit-time-window" className="block text-xs font-display font-bold text-slate-700">
                {isId ? 'Sisa Waktu Aman Konsumsi:' : 'Safe Consumption Window:'}
              </label>
              <select
                id="edit-time-window"
                value={formData.timeWindowId}
                onChange={(e) => setFormData({ ...formData, timeWindowId: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              >
                {TIME_WINDOWS.map((tw) => (
                  <option key={tw.id} value={tw.id}>
                    {tw.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Prepared Time (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="edit-prepared-at" className="block text-xs font-display font-bold text-slate-700">
                {isId ? 'Waktu Penyiapan (Opsional):' : 'Preparation Time (Optional):'}
              </label>
              <input
                id="edit-prepared-at"
                type="datetime-local"
                value={formData.preparedAt ? formData.preparedAt.substring(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, preparedAt: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Expiry Date (Optional) */}
            <div className="space-y-1.5">
              <label htmlFor="edit-expiry-date" className="block text-xs font-display font-bold text-slate-700">
                {isId ? 'Tanggal Kedaluwarsa (Opsional):' : 'Expiry Date (Optional):'}
              </label>
              <input
                id="edit-expiry-date"
                type="date"
                value={formData.expiryDate ? formData.expiryDate.substring(0, 10) : ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-sans text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>

          </div>
        </form>

        {/* Footer - Fixed / Sticky Bottom with Always-Visible Action Buttons */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50/90 backdrop-blur-xs flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs px-4 py-2 font-display font-bold"
          >
            {isId ? 'Batal' : 'Cancel'}
          </Button>

          <Button
            type="submit"
            form="edit-safety-form"
            variant="sun"
            size="sm"
            className="text-xs font-display font-black shadow-sun px-6 py-2"
          >
            {isId ? 'Simpan & Evaluasi Ulang ✨' : 'Save & Re-Evaluate ✨'}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
