import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { getFavorites, removeFavorite, clearFavorites } from '../api/listings';

const STORAGE_KEY = 'wishlist_view_mode';

export function useWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewModeState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'gallery'
  );

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFavorites();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFavorites(); }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (id) => {
    const snapshot = items.find((i) => i.id === id);
    if (!snapshot) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await removeFavorite(id);
    } catch (err) {
      setItems((prev) => [...prev, snapshot]);
      toast.error(err.message);
    }
  }, [items]);

  const clearAll = useCallback(async () => {
    const snapshot = [...items];
    setItems([]);
    try {
      await clearFavorites();
      toast.success('Избранное очищено');
    } catch {
      setItems(snapshot);
      toast.error('Ошибка при очистке избранного');
    }
  }, [items]);

  const setViewMode = useCallback((mode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, []);

  return { items, loading, viewMode, setViewMode, toggleFavorite, clearAll };
}
