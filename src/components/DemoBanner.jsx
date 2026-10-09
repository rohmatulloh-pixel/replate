import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { isDemoMode, loadDemoData, clearAllData } from '../utils/storage';
import Modal from './Modal';

export default function DemoBanner({ onUpdate }) {
  const [demoActive, setDemoActive] = useState(() => isDemoMode());
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    const handler = () => {
      setDemoActive(isDemoMode());
    };
    window.addEventListener('replate:storage-update', handler);
    return () => window.removeEventListener('replate:storage-update', handler);
  }, []);

  const handleLoadDemo = () => {
    loadDemoData();
    setDemoActive(true);
    if (onUpdate) onUpdate();
  };

  const handleConfirmClear = () => {
    clearAllData();
    setShowClearModal(false);
    setDemoActive(false);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-sky-100 via-teal-50 to-amber-50 text-slate-700 text-xs py-2 px-4 border-b border-sky-200/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase text-[10px] tracking-wider px-2.5 py-0.5 rounded-full bg-sun-400 text-amber-950 shadow-sm flex items-center gap-1">
              <span>⭐</span> {demoActive ? 'SAMPLE DATASET ACTIVE' : 'LOCAL-FIRST PROTOCOL'}
            </span>
            <span className="font-sans text-xs text-slate-600">
              {demoActive
                ? '4 realistic competition scenarios loaded (Catering, Bistro, Bakery, Event).'
                : '100% deterministic decision engine running directly in your browser.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!demoActive ? (
              <button
                type="button"
                onClick={handleLoadDemo}
                className="font-display font-bold text-xs text-brand-700 hover:text-brand-900 flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm border border-brand-200 hover:scale-105 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Load Sample Data
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="font-display font-bold text-xs text-coral-500 hover:text-coral-600 flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm border border-coral-200 hover:scale-105 transition-transform"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Reset Local Browser Data"
        confirmLabel="Erase Records"
        confirmVariant="danger"
        onConfirm={handleConfirmClear}
      >
        <p className="mb-2">
          Are you sure you want to clear stored surplus reports and journeys from this browser?
        </p>
        <p className="text-xs text-slate-500">
          This will reset the application to a blank state. You can reload sample data anytime.
        </p>
      </Modal>
    </>
  );
}
