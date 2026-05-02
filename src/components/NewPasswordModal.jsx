import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { changePassword } from '../api/auth';

export default function NewPasswordModal({ open, onSuccess }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов'); return; }
    if (password !== confirm) { setError('Пароли не совпадают'); return; }
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await changePassword(password, token);
      setPassword('');
      setConfirm('');
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const valid = password.length >= 6 && password === confirm;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(8, 38, 115, 0.55)', backdropFilter: 'blur(4px)' }}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
            >
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
                  style={{ backgroundColor: 'var(--bg-light)' }}>
                  <KeyRound size={26} style={{ color: 'var(--primary)' }} />
                </div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Придумайте новый пароль</h2>
                <p className="text-sm mt-1.5 text-gray-400">Введите пароль дважды для подтверждения</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                    Новый пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      autoFocus
                      minLength={6}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      placeholder="Минимум 6 символов"
                      className="input-field pr-10"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                    Повторите пароль
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                      placeholder="Введите пароль ещё раз"
                      className="input-field pr-10"
                      style={confirm.length > 0 && confirm !== password
                        ? { borderColor: 'var(--accent)' }
                        : {}}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && confirm !== password && (
                    <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>Пароли не совпадают</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !valid}
                  className="btn-primary w-full font-medium py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? 'Сохранение...' : 'Сохранить пароль'}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
