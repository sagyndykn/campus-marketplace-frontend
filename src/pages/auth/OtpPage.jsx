import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Mail } from 'lucide-react';
import { verifyOtp, resendOtp } from '../../api/auth';

const OTP_TTL = 120;

export default function OtpPage({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TTL);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Введите 6-значный код'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp: code });
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify({ email: res.email, role: res.role }));
      onSuccess(res);
    } catch (err) {
      setError(err.message);
      setOtp(Array(6).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await resendOtp({ email });
      setTimeLeft(OTP_TTL);
      setOtp(Array(6).fill(''));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const filled = otp.join('').length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e4e9f7 100%)' }}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <button type="button" onClick={onBack} className="btn-back flex items-center gap-1 text-sm mb-6">
          <ChevronLeft size={16} /> Назад
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{ backgroundColor: 'var(--bg-light)' }}>
            <Mail size={26} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>Подтвердите email</h2>
          <p className="text-sm mt-2 text-gray-400">
            Мы отправили 6-значный код на<br />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 justify-center mb-5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input key={i} ref={(el) => (inputs.current[i] = el)}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all"
                style={digit
                  ? { borderColor: 'var(--primary)', backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }
                  : { borderColor: 'var(--border)', color: 'var(--text)' }}
                onFocus={(e) => { if (!digit) e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={(e) => { if (!e.target.value) e.target.style.borderColor = 'var(--border)'; }}
              />
            ))}
          </div>

          <div className="text-center mb-5 h-5">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-400">
                Код действует{' '}
                <span className="font-semibold" style={{ color: timeLeft <= 30 ? 'var(--accent)' : 'var(--primary)' }}>
                  {formatTime(timeLeft)}
                </span>
              </p>
            ) : (
              <button type="button" onClick={handleResend} disabled={resending}
                className="btn-link text-sm font-medium disabled:opacity-50">
                {resending ? 'Отправка...' : 'Отправить код снова'}
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-lg px-4 py-3 text-sm mb-4" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading || !filled}
            className="btn-primary w-full font-medium py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Проверка...' : 'Подтвердить'}
          </button>
        </form>
      </div>
    </div>
  );
}
