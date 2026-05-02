import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SwipePagination({ page, totalPages, onChange, activeIndex, totalItems }) {
  const { t } = useTranslation();

  if (!totalPages || totalPages <= 1) return null;

  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <div className="max-w-sm mx-auto px-4 pb-24 md:pb-8">
      <div className="flex items-center justify-between gap-3 rounded-xl border bg-white dark:bg-gray-900 px-3 py-2 shadow-sm"
        style={{ borderColor: 'var(--border)' }}>
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={isFirst}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: 'var(--primary)' }}
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="text-center min-w-0">
          <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>
            {page + 1} / {totalPages}
          </p>
          {totalItems > 0 && (
            <p className="text-xs text-gray-400">
              {Math.min(activeIndex + 1, totalItems)} / {totalItems}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={isLast}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: 'var(--primary)' }}
          aria-label={t('pagination.next')}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
