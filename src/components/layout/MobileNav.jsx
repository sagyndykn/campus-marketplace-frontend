import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Plus, MessageCircle, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MobileNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;
  const navColor = (path) => ({ color: isActive(path) ? 'var(--primary)' : '#9ca3af' });

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around px-2 py-2">
      <Link to="/" className="flex flex-col items-center gap-0.5 px-3 py-1">
        <Home size={22} style={navColor('/')} />
        <span className="text-xs" style={navColor('/')}>{t('nav.market')}</span>
      </Link>

      <Link to="/wishlist" className="flex flex-col items-center gap-0.5 px-3 py-1">
        <Heart size={22} style={navColor('/wishlist')} />
        <span className="text-xs" style={navColor('/wishlist')}>{t('nav.wishlist')}</span>
      </Link>

      <Link to="/add"
        className="flex items-center justify-center w-12 h-12 rounded-full text-white shadow-lg -mt-5"
        style={{ backgroundColor: 'var(--primary)' }}>
        <Plus size={22} />
      </Link>

      <Link to="/chat" className="flex flex-col items-center gap-0.5 px-3 py-1">
        <MessageCircle size={22} style={navColor('/chat')} />
        <span className="text-xs" style={navColor('/chat')}>{t('nav.chat')}</span>
      </Link>

      <Link to="/profile" className="flex flex-col items-center gap-0.5 px-3 py-1">
        <User size={22} style={navColor('/profile')} />
        <span className="text-xs" style={navColor('/profile')}>{t('nav.profile')}</span>
      </Link>
    </nav>
  );
}
