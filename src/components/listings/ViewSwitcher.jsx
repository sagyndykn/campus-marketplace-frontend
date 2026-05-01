import { Shuffle, LayoutGrid, List, Grid2x2 } from 'lucide-react';

const MODE_CONFIG = {
  swipe:   { icon: Shuffle,    label: 'Свайп' },
  gallery: { icon: LayoutGrid, label: 'Галерея' },
  list:    { icon: List,       label: 'Список' },
  tile:    { icon: Grid2x2,    label: 'Плитка' },
};

export default function ViewSwitcher({ viewMode, onChangeMode, modes }) {
  return (
    <>
      <div
        className="hidden sm:flex items-center rounded-lg overflow-hidden flex-shrink-0"
        style={{ border: '1px solid var(--border)' }}
      >
        {modes.map((mode) => {
          const { icon: Icon, label } = MODE_CONFIG[mode];
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onChangeMode(mode)}
              className="p-1.5 transition-colors"
              title={label}
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
        className="sm:hidden px-2 py-1.5 rounded-lg border text-sm outline-none bg-white flex-shrink-0"
        style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        {modes.map((mode) => (
          <option key={mode} value={mode}>{MODE_CONFIG[mode].label}</option>
        ))}
      </select>
    </>
  );
}
