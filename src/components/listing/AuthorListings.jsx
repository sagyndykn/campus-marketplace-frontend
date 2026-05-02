import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function AuthorListings({ listing }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listing?.sellerId || !listing?.id) return;

    setLoading(true);
    getListings({ sellerId: listing.sellerId, excludeId: listing.id, size: LIMIT })
      .then((page) => setItems(page.content || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [listing?.sellerId, listing?.id]);

  const visibleItems = useMemo(() => uniqueListings(items, listing?.id), [items, listing?.id]);

  if (!loading && visibleItems.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
          {t('listingDetails.authorListings')}
        </h2>
        <button
          type="button"
          onClick={() => navigate(`/profile/${listing.sellerId}/listings`)}
          className="text-sm font-medium shrink-0"
          style={{ color: 'var(--accent)' }}
        >
          {t('listingDetails.viewAll')}
        </button>
      </div>

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
