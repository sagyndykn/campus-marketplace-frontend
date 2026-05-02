import { motion } from 'framer-motion';
import { ListCard } from './ListingCard';

const EMPTY_FAVORITES = new Set();

export default function ListingList({ items, favoritedIds = EMPTY_FAVORITES, onFavoriteToggle, onChat }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((listing, i) => (
        <motion.div
          key={listing.id}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.4) }}
        >
          <ListCard
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
