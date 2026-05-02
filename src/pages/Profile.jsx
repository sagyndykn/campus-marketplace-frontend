import { useState, useEffect, useRef } from 'react';
import { User, Package, Settings, LogOut, Moon, Bell, Loader, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getMe, updateMe, uploadAvatar } from '../api/users';
import { getMyListings } from '../api/listings';
import LanguageSwitcher from '../components/settings/LanguageSwitcher';
import ListingList from '../components/listings/ListingList';
import { useTheme } from '../hooks/useTheme';

export default function Profile({ onLogout }) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveMsgOk, setSaveMsgOk] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    Promise.all([getMe(), getMyListings()])
      .then(([user, listings]) => {
        setProfile(user);
        setMyListings(listings);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const updated = await updateMe({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
      setProfile(updated);
      setSaveMsg(t('profile.saved'));
      setSaveMsgOk(true);
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg(err.message);
      setSaveMsgOk(false);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const updated = await uploadAvatar(file);
      setProfile(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!profile) return null;

  const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email;
  const initial = (profile.firstName || profile.email || 'S')[0].toUpperCase();

  const toggleSettings = [
    {
      icon: <Moon size={16} />,
      label: t('profile.darkMode'),
      value: theme === 'dark',
      onChange: (checked) => setTheme(checked ? 'dark' : 'light'),
    },
    { icon: <Bell size={16} />, label: t('profile.notifications'), value: notifications, onChange: setNotifications },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col items-center py-4">
        <div className="relative mb-3">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: 'var(--primary)' }}>
              {initial}
            </div>
          )}
          <button onClick={() => fileRef.current?.click()} disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-white shadow"
            style={{ backgroundColor: 'var(--accent)' }}>
            {uploadingAvatar ? <Loader size={12} className="animate-spin" /> : <Camera size={12} />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <p className="font-bold text-lg" style={{ color: 'var(--primary)' }}>{displayName}</p>
        <p className="text-sm text-gray-400">{profile.email}</p>
        {profile.role === 'ADMIN' && (
          <span className="mt-1 text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: '#fdf2f2', color: 'var(--accent)' }}>
            {t('profile.admin')}
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>{t('profile.personalData')}</h2>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">{t('profile.firstName')}</label>
              <input type="text" value={profile.firstName || ''} className="input-field input-field-sm"
                onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">{t('profile.lastName')}</label>
              <input type="text" value={profile.lastName || ''} className="input-field input-field-sm"
                onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">{t('profile.phone')}</label>
            <input type="tel" value={profile.phone || ''} placeholder={t('profile.phonePlaceholder')}
              className="input-field input-field-sm"
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">{t('auth.email')}</label>
            <input type="email" value={profile.email} disabled className="input-field input-field-sm" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              {saving && <Loader size={14} className="animate-spin" />}
              {t('profile.save')}
            </button>
            {saveMsg && (
              <span className="text-sm" style={{ color: saveMsgOk ? '#16a34a' : 'var(--accent)' }}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>{t('profile.myListings')}</h2>
          {myListings.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
              {myListings.length}
            </span>
          )}
        </div>
        {myListings.length === 0 ? (
          <p className="text-sm text-gray-400">{t('profile.noListings')}</p>
        ) : (
          <ListingList items={myListings} />
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>{t('profile.settings')}</h2>
        </div>
        <div className="space-y-3">
          <LanguageSwitcher />
          {toggleSettings.map(({ icon, label, value, onChange }) => (
            <div key={label} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2 text-gray-400">
                {icon}
                <span className="text-sm" style={{ color: 'var(--text)' }}>{label}</span>
              </div>
              <button onClick={() => onChange(!value)}
                className="w-10 h-6 rounded-full transition-colors relative"
                style={{ backgroundColor: value ? 'var(--primary)' : '#d1d5db' }}>
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm"
                  style={{ left: value ? 22 : 4 }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onLogout}
        className="btn-outline-accent w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium">
        <LogOut size={16} />
        {t('profile.logout')}
      </button>
    </div>
  );
}
