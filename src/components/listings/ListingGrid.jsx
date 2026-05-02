import { motion } from 'framer-motion';
import { GalleryCard } from './ListingCard';

const EMPTY_FAVORITES = new Set();

export default function ListingGrid({ items, favoritedIds = EMPTY_FAVORITES, onFavoriteToggle, onChat }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.4) }}
        >
          <GalleryCard
            listing={listing}
            isFavorited={favoritedIds.has(listing.id)}
            onFavoriteToggle={onFavoriteToggle}
            onChat={onChat}
          />
        </motion.div>
      ))}
    </div>
  );
}
