const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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

export const startConversation = (sellerId, listingId = null) =>
  request('POST', '/chat/conversations', { sellerId, listingId });

export const searchUsers = (q) =>
  request('GET', `/users/search?q=${encodeURIComponent(q)}`);

export const uploadChatMedia = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE_URL}/chat/media/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const text = await res.text();
  if (!res.ok) {
    try {
      const json = JSON.parse(text);
      throw new Error(json.error || Object.values(json).join(', '));
    } catch (e) {
      if (e.message && !e.message.includes('JSON')) throw e;
      throw new Error(text || 'Ошибка загрузки');
    }
  }
  return JSON.parse(text);
};

export const getConversations = () =>
  request('GET', '/chat/conversations');

export const getMessages = (conversationId) =>
  request('GET', `/chat/conversations/${conversationId}/messages`);

export const getPresence = (userId) =>
  request('GET', `/chat/presence/${userId}`);

export const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  return apiUrl.replace('/api', '') + '/ws';
};
