const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authHeaders = (json = true) => {
  const h = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
};

async function request(method, endpoint, body) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || Object.values(json).join(', '));
    } catch (e) {
      if (e.message && !e.message.includes('JSON')) throw e;
      throw new Error(text || 'Ошибка сервера');
    }
  }
  return JSON.parse(text);
}

export const getMe = () => request('GET', '/users/me');

export const updateMe = (data) => request('PUT', '/users/me', data);

export const uploadAvatar = (file) => {
  const form = new FormData();
  form.append('file', file);
  return fetch(`${BASE_URL}/users/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: form,
  }).then(async (r) => {
    const text = await r.text();
    if (!r.ok) throw new Error(text);
    return JSON.parse(text);
  });
};
