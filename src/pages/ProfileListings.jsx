import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getListings } from '../api/listings';
import ListingGrid from '../components/listings/ListingGrid';

export default function ProfileListings() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getListings({ sellerId, size: 50 })
      .then((page) => setItems(page.content || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [sellerId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-5 pb-24 md:pb-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium mb-4"
        style={{ color: 'var(--primary)' }}
      >
        <ArrowLeft size={16} />
        {t('common.back')}
      </button>

      <h1 className="text-2xl font-bold mb-5" style={{ color: 'var(--primary)' }}>
        {t('listingDetails.authorListings')}
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : (
        <ListingGrid items={items} />
      )}
    </div>
  );
}
