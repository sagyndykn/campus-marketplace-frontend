import { useState, useEffect, useRef } from 'react';
import { User, Package, Settings, LogOut, Moon, Bell, Loader, Camera } from 'lucide-react';
import { getMe, updateMe, uploadAvatar } from '../api/users';
import { getMyListings } from '../api/listings';
import { CATEGORY_LABELS } from '../data/listings';

export default function Profile({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [saveMsg, setSaveMsg] = useState('');
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
      setSaveMsg('Сохранено');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch (err) {
      setSaveMsg(err.message);
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
    { icon: <Moon size={16} />, label: 'Тёмная тема', value: darkMode, onChange: setDarkMode },
    { icon: <Bell size={16} />, label: 'Уведомления', value: notifications, onChange: setNotifications },
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
            Администратор
          </span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>Личные данные</h2>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Имя</label>
              <input type="text" value={profile.firstName || ''} className="input-field input-field-sm"
                onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Фамилия</label>
              <input type="text" value={profile.lastName || ''} className="input-field input-field-sm"
                onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Телефон</label>
            <input type="tel" value={profile.phone || ''} placeholder="+7 (XXX) XXX-XX-XX"
              className="input-field input-field-sm"
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
            <input type="email" value={profile.email} disabled className="input-field input-field-sm" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60">
              {saving && <Loader size={14} className="animate-spin" />}
              Сохранить
            </button>
            {saveMsg && (
              <span className="text-sm" style={{ color: saveMsg === 'Сохранено' ? '#16a34a' : 'var(--accent)' }}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>Мои объявления</h2>
          {myListings.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full ml-1"
              style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
              {myListings.length}
            </span>
          )}
        </div>
        {myListings.length === 0 ? (
          <p className="text-sm text-gray-400">Вы ещё ничего не разместили</p>
        ) : (
          <div className="flex flex-col gap-2">
            {myListings.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                <div className="w-8 h-8 rounded-lg shrink-0" style={{ backgroundColor: 'var(--bg-light)' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{item.title}</p>
                  <p className="text-xs text-gray-400">{CATEGORY_LABELS[item.category] || item.category}</p>
                </div>
                <p className="text-sm font-bold shrink-0" style={{ color: 'var(--accent)' }}>
                  {item.price?.toLocaleString('ru-RU')} ₸
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Settings size={18} style={{ color: 'var(--primary)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--primary)' }}>Настройки</h2>
        </div>
        <div className="space-y-3">
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
        Выйти из аккаунта
      </button>
    </div>
  );
}
