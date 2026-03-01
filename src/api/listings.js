const BASE_URL = 'http://localhost:8080/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

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
  if (!text) return null;
  return JSON.parse(text);
}

export const getListings = ({ category, search, minPrice, maxPrice, page = 0, size = 20 } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  if (minPrice != null) params.set('minPrice', minPrice);
  if (maxPrice != null) params.set('maxPrice', maxPrice);
  params.set('page', page);
  params.set('size', size);
  return request('GET', `/listings?${params}`);
};

export const getMyListings = () => request('GET', '/listings/my');

export const getListing = (id) => request('GET', `/listings/${id}`);

export const createListing = (data) => request('POST', '/listings', data);

export const updateListing = (id, data) => request('PUT', `/listings/${id}`, data);

export const deleteListing = (id) => request('DELETE', `/listings/${id}`);

export const uploadListingPhotos = (id, files) => {
  const form = new FormData();
  files.forEach((f) => form.append('files', f));
  return fetch(`${BASE_URL}/listings/${id}/photos`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    body: form,
  }).then((r) => r.json());
};
