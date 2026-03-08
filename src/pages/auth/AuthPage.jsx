import { useState } from 'react';
import { ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { register, login } from '../../api/auth';

export default function AuthPage({ onOtpSent, onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const switchMode = (m) => { setMode(m); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
        onOtpSent(form.email);
      } else {
        const res = await login({ email: form.email, password: form.password });
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({ email: res.email, role: res.role }));
        onLogin(res);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e4e9f7 100%)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{ backgroundColor: 'var(--primary)' }}>
            <ShoppingBag size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Campus Marketplace</h1>
          <p className="text-sm mt-1 font-medium" style={{ color: 'var(--accent)' }}>SDU University</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {['login', 'register'].map((m) => (
            <button key={m} type="button" onClick={() => switchMode(m)}
              className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
              style={mode === m
                ? { backgroundColor: 'var(--primary)', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }
                : { color: 'var(--text)' }
              }>
              {m === 'login' ? 'Войти' : 'Регистрация'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Имя</label>
                <input type="text" required value={form.firstName} onChange={set('firstName')}
                  placeholder="Имя" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Фамилия</label>
                <input type="text" required value={form.lastName} onChange={set('lastName')}
                  placeholder="Фамилия" className="input-field" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Email</label>
            <input type="email" required value={form.email} onChange={set('email')}
              placeholder="example@sdu.edu.kz"
              pattern="[a-zA-Z0-9._%+\-]+@sdu\.edu\.kz"
              className="input-field" />
            <p className="text-xs text-gray-400 mt-1">Только почта @sdu.edu.kz</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Пароль</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} required minLength={6}
                value={form.password} onChange={set('password')}
                placeholder={mode === 'register' ? 'Минимум 6 символов' : 'Ваш пароль'}
                className="input-field pr-10" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="btn-primary w-full font-medium py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Подождите...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}
