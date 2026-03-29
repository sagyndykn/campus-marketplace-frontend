import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Loader } from 'lucide-react';
import { useMarket } from '../context/MarketContext';
import { getListings } from '../api/listings';
import { CATEGORY_LABELS } from '../data/listings';
import { toast } from 'sonner';

const SWIPE_THRESHOLD = 100;
const FEED_SIZE = 50;
const MAX_DOTS = 10;

function ListingCard({ listing, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe('right');
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe('left');
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      initial={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 12 }}
    >
      {isTop && (
        <>
          <motion.div className="absolute top-6 left-6 z-10 border-4 rounded-lg px-3 py-1 font-bold text-lg rotate-[-12deg]"
            style={{ opacity: likeOpacity, borderColor: 'var(--primary)', color: 'var(--primary)' }}>
            ЛАЙК
          </motion.div>
          <motion.div className="absolute top-6 right-6 z-10 border-4 rounded-lg px-3 py-1 font-bold text-lg rotate-[12deg]"
            style={{ opacity: nopeOpacity, borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            ПРОПУСК
          </motion.div>
        </>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden select-none" style={{ height: 460 }}>
        <div className="flex items-center justify-center" style={{ height: 260, backgroundColor: 'var(--bg-light)' }}>
          {listing.photoUrls?.length > 0 ? (
            <img src={listing.photoUrls[0]} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-white opacity-50" />
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
                {CATEGORY_LABELS[listing.category] || listing.category}
              </span>
              <h3 className="text-lg font-bold mt-2 line-clamp-1" style={{ color: 'var(--primary)' }}>
                {listing.title}
              </h3>
            </div>
            <span className="text-lg font-bold ml-2 shrink-0" style={{ color: 'var(--accent)' }}>
              {listing.price?.toLocaleString('ru-RU')} ₸
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2 mb-3">{listing.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {listing.sellerAvatarUrl ? (
                <img src={listing.sellerAvatarUrl} className="w-7 h-7 rounded-full object-cover" alt="" />
              ) : (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent)' }}>
                  {(listing.sellerName || '?')[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {listing.sellerName || 'Аноним'}
              </span>
            </div>
            <button className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
              <MessageCircle size={13} /> Написать
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Index() {
  const { addToWishlist } = useMarket();
  const [listings, setListings] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getListings({ size: FEED_SIZE })
      .then((page) => setListings(page.content || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      addToWishlist(listings[index]);
      toast.success('Добавлено в вишлист', { duration: 1500 });
    }
    setIndex((i) => i + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <p className="text-sm text-gray-400">Загружаем объявления...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{error}</p>
        <button onClick={() => window.location.reload()}
          className="btn-primary px-4 py-2 rounded-lg text-sm">
          Повторить
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>Объявлений пока нет</p>
      </div>
    );
  }

  const remaining = listings.slice(index);
  const dots = Math.min(listings.length, MAX_DOTS);

  return (
    <div className="max-w-sm mx-auto px-4 py-6">
      <div className="flex justify-center gap-1.5 mb-6">
        {Array.from({ length: dots }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === Math.min(index, dots - 1) ? 24 : 8,
              backgroundColor: i <= index ? 'var(--primary)' : '#d1d5db',
            }} />
        ))}
      </div>

      <div className="relative" style={{ height: 460 }}>
        <AnimatePresence>
          {remaining.length > 0 ? (
            remaining.slice(0, 2).reverse().map((listing, i) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isTop={i === remaining.slice(0, 2).length - 1}
                onSwipe={handleSwipe}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg gap-3"
            >
              <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>Всё просмотрено!</p>
              <p className="text-gray-400 text-sm">Вы просмотрели все объявления</p>
              <button onClick={() => setIndex(0)}
                className="btn-primary px-6 py-2.5 rounded-lg font-medium mt-2">
                Смотреть снова
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {remaining.length > 0 && (
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ border: '2px solid #fee2e2' }}>
            <X size={24} style={{ color: 'var(--accent)' }} />
          </button>
          <button onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ border: '2px solid var(--bg-light)' }}>
            <Heart size={24} style={{ color: 'var(--primary)' }} />
          </button>
        </div>
      )}
    </div>
  );
}
