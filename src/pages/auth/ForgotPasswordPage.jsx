import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, KeyRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forgotPassword, verifyResetOtp } from '../../api/auth';

const RESET_TTL = 300;

export default function ForgotPasswordPage({ onBack, onVerified }) {
  const { t } = useTranslation();
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(RESET_TTL);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    if (step === 'otp') inputs.current[0]?.focus();
  }, [step]);

  useEffect(() => {
    if (step !== 'otp' || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [step, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setStep('otp');
      setTimeLeft(RESET_TTL);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await forgotPassword({ email });
      setTimeLeft(RESET_TTL);
      setOtp(Array(6).fill(''));
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError(t('otp.error6digits')); return; }
    setError('');
    setLoading(true);
    try {
      const res = await verifyResetOtp({ email, otp: code });
      onVerified(res);
    } catch (err) {
      setError(err.message);
      setOtp(Array(6).fill(''));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const otpFilled = otp.join('').length === 6;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-slate-200 dark:from-slate-950 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8">

        <button
          type="button"
          onClick={step === 'otp' ? () => { setStep('email'); setOtp(Array(6).fill('')); } : onBack}
          className="btn-back flex items-center gap-1 text-sm mb-6"
        >
          <ChevronLeft size={16} /> {t('otp.back')}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4"
            style={{ backgroundColor: 'var(--bg-light)' }}>
            <KeyRound size={26} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
            {step === 'email' ? t('forgotPwd.title') : t('forgotPwd.otpTitle')}
          </h2>
          <p className="text-sm mt-2 text-gray-400">
            {step === 'email'
              ? t('forgotPwd.emailDesc')
              : <>{t('forgotPwd.otpDesc')}<br /><span className="font-semibold" style={{ color: 'var(--text)' }}>{email}</span></>
            }
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                pattern="[a-zA-Z0-9._%+\-]+@sdu\.edu\.kz"
                className="input-field"
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1">{t('auth.emailHint')}</p>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full font-medium py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? t('forgotPwd.sending') : t('forgotPwd.sendCode')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none transition-all"
                  style={digit
                    ? { borderColor: 'var(--primary)', backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }
                    : { borderColor: 'var(--border)', color: 'var(--text)' }}
                  onFocus={(e) => { if (!digit) e.target.style.borderColor = 'var(--primary)'; }}
                  onBlur={(e) => { if (!e.target.value) e.target.style.borderColor = 'var(--border)'; }}
                />
              ))}
            </div>

            <div className="text-center h-5">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-400">
                  {t('otp.codeValid')}{' '}
                  <span className="font-semibold" style={{ color: timeLeft <= 60 ? 'var(--accent)' : 'var(--primary)' }}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <button type="button" onClick={handleResend} disabled={resending}
                  className="btn-link text-sm font-medium disabled:opacity-50">
                  {resending ? t('otp.sending') : t('otp.resend')}
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: '#fdf2f2', border: '1px solid #f5c6c6', color: 'var(--accent)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !otpFilled}
              className="btn-primary w-full font-medium py-2.5 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? t('forgotPwd.confirming') : t('forgotPwd.confirmCode')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
