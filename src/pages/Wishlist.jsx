import { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import ViewSwitcher from '../components/listings/ViewSwitcher';
import ListingGrid from '../components/listings/ListingGrid';
import ListingList from '../components/listings/ListingList';
import ListingTileGrid from '../components/listings/ListingTileGrid';
import EmptyState from '../components/wishlist/EmptyState';
import SkeletonLoader from '../components/wishlist/SkeletonLoader';

const WISHLIST_MODES = ['gallery', 'list', 'tile'];

export default function Wishlist() {
  const { items, loading, viewMode, setViewMode, toggleFavorite, clearAll } = useWishlist();

  const favoritedIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);
  const handleFavoriteToggle = (listing) => toggleFavorite(listing.id);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-8 pt-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 pt-4 md:pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
                Избранное
              </h1>
              {!loading && (
                <p className="text-sm text-gray-400 mt-0.5">
                  Объявления ({items.length})
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!loading && items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  <Trash2 size={14} />
                  Очистить избранное
                </button>
              )}
              <ViewSwitcher viewMode={viewMode} onChangeMode={setViewMode} modes={WISHLIST_MODES} />
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {loading ? (
            <SkeletonLoader viewMode={viewMode} />
          ) : items.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="popLayout">
              {viewMode === 'gallery' && (
                <ListingGrid
                  key="gallery"
                  items={items}
                  favoritedIds={favoritedIds}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )}
              {viewMode === 'list' && (
                <ListingList
                  key="list"
                  items={items}
                  favoritedIds={favoritedIds}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )}
              {viewMode === 'tile' && (
                <ListingTileGrid
                  key="tile"
                  items={items}
                  favoritedIds={favoritedIds}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
