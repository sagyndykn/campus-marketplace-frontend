import { request, uploadFiles } from './client';

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
export const uploadListingPhotos = (id, files) => uploadFiles(`/listings/${id}/photos`, files);
