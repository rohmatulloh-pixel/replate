import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  confirmVariant = 'primary',
  showActions = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 shadow-card relative space-y-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Close X */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        {title && (
          <h3 className="text-xl sm:text-2xl font-display font-extrabold text-brand-900 pb-3 border-b border-slate-100 pr-8">
            {title}
          </h3>
        )}

        {/* Content */}
        <div className="text-xs sm:text-sm font-sans font-semibold text-slate-600 leading-relaxed">
          {children}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} size="sm" onClick={onConfirm} className="text-xs">
                {confirmLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
