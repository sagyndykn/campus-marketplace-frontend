import { request, uploadFile } from './client';

export const startConversation = (sellerId, listingId = null) =>
  request('POST', '/chat/conversations', { sellerId, listingId });

export const searchUsers = (q) =>
  request('GET', `/users/search?q=${encodeURIComponent(q)}`);

export const uploadChatMedia = (file) => uploadFile('/chat/media/upload', file);

export const getConversations = () => request('GET', '/chat/conversations');

export const getMessages = (conversationId) =>
  request('GET', `/chat/conversations/${conversationId}/messages`);

export const getPresence = (userId) =>
  request('GET', `/chat/presence/${userId}`);

export const getWsUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
  return apiUrl.replace('/api', '') + '/ws';
};
