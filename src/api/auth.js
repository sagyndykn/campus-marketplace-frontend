const BASE_URL = 'http://localhost:8080/api';

async function request(endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      const msg = Object.values(json).join(', ');
      throw new Error(msg);
    } catch (e) {
      if (e.message && !e.message.includes('JSON')) throw e;
      throw new Error(text || 'Произошла ошибка');
    }
  }
  try { return JSON.parse(text); } catch { return text; }
}

export const register = (data) => request('/auth/register', data);
export const login = (data) => request('/auth/login', data);
export const verifyOtp = (data) => request('/auth/verify-otp', data);
export const resendOtp = (data) => request('/auth/resend-otp', data);
export const logout = (token) =>
  fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
