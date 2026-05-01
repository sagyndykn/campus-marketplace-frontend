import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function FiltersModal({ open, onClose, filters, onApply }) {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Фильтры</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} style={{ color: 'var(--text)' }} />
              </button>
            </div>

            <div className="mb-5">
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Цена (₸)</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="От"
                  value={local.minPrice}
                  onChange={(e) => setLocal((p) => ({ ...p, minPrice: e.target.value }))}
                  className="input-field flex-1"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="До"
                  value={local.maxPrice}
                  onChange={(e) => setLocal((p) => ({ ...p, maxPrice: e.target.value }))}
                  className="input-field flex-1"
                  min={0}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setLocal((p) => ({ ...p, onlyWithPhoto: !p.onlyWithPhoto }))}
                  className="w-11 h-6 rounded-full transition-colors relative flex-shrink-0"
                  style={{ backgroundColor: local.onlyWithPhoto ? 'var(--primary)' : '#d1d5db' }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                    style={{ transform: local.onlyWithPhoto ? 'translateX(20px)' : 'translateX(2px)' }}
                  />
                </button>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  Только с фото
                </span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Сбросить
              </button>
              <button
                onClick={handleApply}
                className="flex-1 btn-primary py-2.5 rounded-lg text-sm font-medium"
              >
                Применить
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
