import { Search, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CATEGORY_VALUES } from '../../data/listings';
import ViewSwitcher from '../listings/ViewSwitcher';

const FEED_MODES = ['swipe', 'gallery', 'list', 'tile'];

export default function FeedHeader({
  search, onSearchChange,
  category, onCategoryChange,
  sort, onSortChange,
  viewMode, onViewModeChange,
  onFiltersOpen,
  resultCount,
  loading,
  hasActiveFilters,
}) {
  const { t } = useTranslation();

  const SORT_OPTIONS = [
    { value: 'recommended', label: t('sort.recommended') },
    { value: 'newest', label: t('sort.newest') },
    { value: 'cheapest', label: t('sort.cheapest') },
    { value: 'expensive', label: t('sort.expensive') },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 space-y-2 sticky top-0 md:top-16 z-30">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('feed.search')}
            className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm outline-none transition-colors bg-white dark:bg-gray-800"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>
        <button
          onClick={onFiltersOpen}
          className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 flex-shrink-0"
          style={{ borderColor: hasActiveFilters ? 'var(--primary)' : 'var(--border)', color: hasActiveFilters ? 'var(--primary)' : 'var(--text)' }}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">{t('feed.filters')}</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border text-sm outline-none bg-white dark:bg-gray-800"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          <option value="">{t('feed.allCategories')}</option>
          {CATEGORY_VALUES.map((val) => (
            <option key={val} value={val}>{t('categories.' + val)}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 rounded-lg border text-sm outline-none bg-white dark:bg-gray-800"
          style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <ViewSwitcher viewMode={viewMode} onChangeMode={onViewModeChange} modes={FEED_MODES} />
      </div>

      {!loading && resultCount !== undefined && search && (
        <p className="text-xs text-gray-400">
          {resultCount > 0 ? t('feed.found', { count: resultCount }) : t('feed.notFound')}
        </p>
      )}
    </div>
  );
}
