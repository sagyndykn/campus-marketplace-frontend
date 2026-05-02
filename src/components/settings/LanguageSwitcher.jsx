import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'ru', label: 'Рус' },
  { code: 'kk', label: 'Қаз' },
  { code: 'en', label: 'Eng' },
];

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2);

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2 text-gray-400">
        <Globe size={16} />
        <span className="text-sm" style={{ color: 'var(--text)' }}>{t('profile.language')}</span>
      </div>
      <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            className="px-2.5 py-1 text-xs font-medium transition-all"
            style={
              current === code
                ? { backgroundColor: 'var(--primary)', color: '#fff' }
                : { backgroundColor: '#f3f4f6', color: '#6b7280' }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
