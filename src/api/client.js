export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

// Singleton promise — если сразу несколько запросов получат 401,
// рефреш делается только один раз, остальные ждут его результата.
let refreshPromise = null;

async function tryRefresh() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error('refresh_failed');
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

function notifyExpired() {
  window.dispatchEvent(new Event('auth:expired'));
}

const authHeaders = (json = true) => {
  const h = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  if (json) h['Content-Type'] = 'application/json';
  return h;
};

async function parseResponse(res) {
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
  if (!text) return null;
  return JSON.parse(text);
}

export async function request(method, endpoint, body) {
  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 || res.status === 403) {
    try {
      await tryRefresh();
    } catch {
      notifyExpired();
      throw new Error('Сессия истекла. Войдите снова.');
    }
    // Повторяем запрос с новым токеном
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: authHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 || res.status === 403) {
      notifyExpired();
      throw new Error('Сессия истекла. Войдите снова.');
    }
  }

  return parseResponse(res);
}

async function sendFile(endpoint, form) {
  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: form,
  });

  if (res.status === 401 || res.status === 403) {
    try {
      await tryRefresh();
    } catch {
      notifyExpired();
      throw new Error('Сессия истекла. Войдите снова.');
    }
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: form,
    });
    if (res.status === 401 || res.status === 403) {
      notifyExpired();
      throw new Error('Сессия истекла. Войдите снова.');
    }
  }

  const text = await res.text();
  if (!res.ok) throw new Error(text || 'Ошибка загрузки');
  return JSON.parse(text);
}

export const uploadFile = (endpoint, file, fieldName = 'file') => {
  const form = new FormData();
  form.append(fieldName, file);
  return sendFile(endpoint, form);
};

export const uploadFiles = (endpoint, files, fieldName = 'files') => {
  const form = new FormData();
  files.forEach((f) => form.append(fieldName, f));
  return sendFile(endpoint, form);
};
