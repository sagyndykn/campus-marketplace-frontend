import { Shuffle, LayoutGrid, List, Grid2x2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MODE_ICONS = {
  swipe:   Shuffle,
  gallery: LayoutGrid,
  list:    List,
  tile:    Grid2x2,
};

export default function ViewSwitcher({ viewMode, onChangeMode, modes }) {
  const { t } = useTranslation();

  return (
    <>
      <div
        className="hidden sm:flex items-center rounded-lg overflow-hidden flex-shrink-0"
        style={{ border: '1px solid var(--border)' }}
      >
        {modes.map((mode) => {
          const Icon = MODE_ICONS[mode];
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onChangeMode(mode)}
              className="p-1.5 transition-colors"
              title={t('view.' + mode)}
              style={{
                backgroundColor: active ? 'var(--primary)' : 'transparent',
                color: active ? '#fff' : 'var(--text)',
              }}
            >
              <Icon size={16} />
            </button>
          );
        })}
      </div>

      <select
        value={viewMode}
        onChange={(e) => onChangeMode(e.target.value)}
        className="sm:hidden px-2 py-1.5 rounded-lg border text-sm outline-none bg-white dark:bg-gray-800 flex-shrink-0"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        {modes.map((mode) => (
          <option key={mode} value={mode}>{t('view.' + mode)}</option>
        ))}
      </select>
    </>
  );
}
