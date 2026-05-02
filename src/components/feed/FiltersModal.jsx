import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FiltersModal({ open, onClose, filters, onApply }) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (open) setLocal(filters);
  }, [open, filters]);

  const handleApply = () => {
    onApply(local);
    onClose();
  };

  const handleReset = () => {
    const empty = { minPrice: '', maxPrice: '', onlyWithPhoto: false };
    setLocal(empty);
    onApply(empty);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay — выше bottom nav (z-50) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[90]"
          />

          {/* bottom sheet — выше overlay */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 right-0 bottom-0 z-[100] bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100dvh - 24px)' }}
          >
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
              <h2 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                {t('filters.title')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <X size={18} style={{ color: 'var(--text)' }} />
              </button>
            </div>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto px-6">
              {/* price */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  {t('filters.price')}
                </p>
                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder={t('filters.from')}
                    value={local.minPrice}
                    onChange={(e) => setLocal((p) => ({ ...p, minPrice: e.target.value }))}
                    className="input-field"
                    min={0}
                  />
                  <input
                    type="number"
                    placeholder={t('filters.to')}
                    value={local.maxPrice}
                    onChange={(e) => setLocal((p) => ({ ...p, maxPrice: e.target.value }))}
                    className="input-field"
                    min={0}
                  />
                </div>
              </div>

              {/* toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {t('filters.onlyWithPhoto')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLocal((p) => ({ ...p, onlyWithPhoto: !p.onlyWithPhoto }))}
                    className="w-10 h-6 rounded-full transition-colors relative flex-shrink-0"
                    style={{ backgroundColor: local.onlyWithPhoto ? 'var(--primary)' : '#d1d5db' }}
                  >
                    <div
                      className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm"
                      style={{ left: local.onlyWithPhoto ? 22 : 4 }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* sticky footer */}
            <div
              className="flex-shrink-0 px-6 pt-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
              style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
            >
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  {t('filters.reset')}
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 btn-primary py-2.5 rounded-lg text-sm font-medium"
                >
                  {t('filters.apply')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
