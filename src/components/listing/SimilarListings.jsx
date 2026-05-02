import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GalleryCard } from '../listings/ListingCard';
import { getListings } from '../../api/listings';

const LIMIT = 8;

function uniqueListings(listings, excludeId) {
  const seen = new Set();
  return listings
    .filter((listing) => listing.id !== excludeId)
    .filter((listing) => {
      if (seen.has(listing.id)) return false;
      seen.add(listing.id);
      return true;
    })
    .slice(0, LIMIT);
}

export default function SimilarListings({ listing }) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listing?.category || !listing?.id) return;

    setLoading(true);
    getListings({ categoryId: listing.category, excludeId: listing.id, size: LIMIT })
      .then((page) => setItems(page.content || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [listing?.category, listing?.id]);

  const visibleItems = useMemo(() => uniqueListings(items, listing?.id), [items, listing?.id]);

  if (!loading && visibleItems.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--primary)' }}>
        {t('listingDetails.similarListings')}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-64 h-80 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse shrink-0"
              />
            ))
          : visibleItems.map((item) => (
              <div key={item.id} className="w-64 shrink-0 snap-start">
                <GalleryCard listing={item} isFavorited={item.favorited} />
              </div>
            ))}
      </div>
    </section>
  );
}
