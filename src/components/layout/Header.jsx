import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Маркет' },
  { to: '/wishlist', label: 'Вишлист' },
  { to: '/chat', label: 'Чат' },
  { to: '/profile', label: 'Профиль' },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="hidden md:flex sticky top-0 z-50 items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: 'var(--primary)' }}>
        Campus <span style={{ color: 'var(--accent)' }}>Market</span>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV.map(({ to, label }) => (
          <Link key={to} to={to}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={pathname === to
              ? { backgroundColor: 'var(--primary)', color: '#fff' }
              : { color: 'var(--text)' }
            }>
            {label}
          </Link>
        ))}
      </nav>

      <Link to="/add" className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium">
        + Добавить
      </Link>
    </header>
  );
}
