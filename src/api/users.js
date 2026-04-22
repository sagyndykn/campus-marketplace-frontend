import { request, uploadFile } from './client';

export const getMe = () => request('GET', '/users/me');
export const updateMe = (data) => request('PUT', '/users/me', data);
export const uploadAvatar = (file) => uploadFile('/users/me/avatar', file);
