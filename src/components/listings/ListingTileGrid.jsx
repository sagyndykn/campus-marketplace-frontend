import { motion } from 'framer-motion';
import { TileCard } from './ListingCard';

const EMPTY_FAVORITES = new Set();

export default function ListingTileGrid({ items, favoritedIds = EMPTY_FAVORITES, onFavoriteToggle, onChat }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
      {items.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: Math.min(i * 0.03, 0.3) }}
        >
          <TileCard
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
