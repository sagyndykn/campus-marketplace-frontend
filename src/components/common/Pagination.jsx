import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function buildPages(page, totalPages) {
  const current = page + 1;
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
  const result = [];

  sorted.forEach((item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) {
      result.push(`ellipsis-${item}`);
    }
    result.push(item);
  });

  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  const { t } = useTranslation();

  if (!totalPages || totalPages <= 1) return null;

  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;
  const pages = buildPages(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 pt-6" aria-label={t('pagination.label')}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={isFirst}
        className="w-9 h-9 rounded-lg border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        aria-label={t('pagination.previous')}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((item) => {
        if (typeof item === 'string') {
          return (
            <span key={item} className="w-9 h-9 flex items-center justify-center text-gray-400">
              ...
            </span>
          );
        }

        const active = item === page + 1;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item - 1)}
            className="w-9 h-9 rounded-lg border text-sm font-semibold transition-colors"
            style={{
              borderColor: active ? 'var(--primary)' : 'var(--border)',
              backgroundColor: active ? 'var(--primary)' : 'transparent',
              color: active ? '#fff' : 'var(--text)',
            }}
            aria-current={active ? 'page' : undefined}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={isLast}
        className="w-9 h-9 rounded-lg border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        aria-label={t('pagination.next')}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
