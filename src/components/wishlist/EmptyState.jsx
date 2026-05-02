import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'var(--bg-light)' }}
      >
        <Heart size={36} style={{ color: 'var(--primary)' }} strokeWidth={1.5} />
      </div>
      <p className="text-base font-semibold" style={{ color: 'var(--primary)' }}>
        {t('emptyState.title')}
      </p>
      <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
        {t('emptyState.desc')}
      </p>
      <Link
        to="/"
        className="btn-primary mt-5 px-5 py-2 rounded-lg text-sm font-medium inline-block"
      >
        {t('emptyState.go')}
      </Link>
    </div>
  );
}
