import { useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, animate } from 'framer-motion';
import { X, Heart, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { handleListingCardKeyDown, useListingNavigation } from '../../hooks/useListingNavigation';

const SWIPE_THRESHOLD = 80;
const VELOCITY_THRESHOLD = 400;

const SwipeCard = forwardRef(function SwipeCard({ listing, onSwipe, isTop, onChat }, ref) {
  const { t } = useTranslation();
  const openListing = useListingNavigation(listing);
  const draggedRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  const flyOff = useCallback(async (direction) => {
    await animate(x, direction === 'right' ? 650 : -650, {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    onSwipe(direction);
  }, [x, onSwipe]);

  useImperativeHandle(ref, () => ({ swipe: flyOff }), [flyOff]);

  const handleDrag = (_, info) => {
    draggedRef.current = Math.abs(info.offset.x) > 6;
  };

  const handleDragEnd = async (_, info) => {
    const { offset, velocity } = info;
    if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) {
      await flyOff('right');
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) {
      await flyOff('left');
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  const handleCardClick = () => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    openListing();
  };

  return (
    <motion.div
      className="absolute w-full touch-none"
      style={{ x, rotate }}
      drag={isTop ? 'x' : false}
      dragConstraints={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 12 }}
      animate={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 12 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
    >
      {isTop && (
        <>
          <motion.div
            className="absolute top-6 left-6 z-10 border-4 rounded-lg px-3 py-1 font-bold text-lg rotate-[-12deg]"
            style={{ opacity: likeOpacity, borderColor: 'var(--primary)', color: 'var(--primary)' }}
          >
            {t('swipe.like')}
          </motion.div>
          <motion.div
            className="absolute top-6 right-6 z-10 border-4 rounded-lg px-3 py-1 font-bold text-lg rotate-[12deg]"
            style={{ opacity: nopeOpacity, borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            {t('swipe.skip')}
          </motion.div>
        </>
      )}

      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden select-none cursor-pointer"
        style={{ height: 460 }}
        onClick={handleCardClick}
        onKeyDown={(e) => handleListingCardKeyDown(e, openListing)}
        role="link"
        tabIndex={isTop ? 0 : -1}
      >
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
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}
              >
                {t('categories.' + listing.category, { defaultValue: listing.category })}
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
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {(listing.sellerName || '?')[0].toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {listing.sellerName || t('listing.anonymous')}
              </span>
            </div>
            {onChat && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChat(listing); }}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}
              >
                <MessageCircle size={13} /> {t('listing.write')}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default function ListingSwipe({ listings, swipeIndex, onSwipe, onChat, onReset }) {
  const { t } = useTranslation();
  const topCardRef = useRef(null);
  const remaining = listings.slice(swipeIndex);

  return (
    <div className="max-w-sm mx-auto px-4 py-4 touch-none overscroll-contain">
      <div className="relative" style={{ height: 460 }}>
        <AnimatePresence>
          {remaining.length > 0 ? (
            remaining.slice(0, 2).reverse().map((listing, i) => {
              const isTopCard = i === remaining.slice(0, 2).length - 1;
              return (
                <SwipeCard
                  key={listing.id}
                  ref={isTopCard ? topCardRef : null}
                  listing={listing}
                  isTop={isTopCard}
                  onSwipe={onSwipe}
                  onChat={onChat}
                />
              );
            })
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg gap-3"
            >
              <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>{t('swipe.allViewed')}</p>
              <p className="text-gray-400 text-sm">{t('swipe.viewedAll')}</p>
              <button
                type="button"
                onClick={onReset}
                className="btn-primary px-6 py-2.5 rounded-lg font-medium mt-2"
              >
                {t('swipe.viewAgain')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {remaining.length > 0 && (
        <div className="flex justify-center gap-6 mt-6">
          <button
            type="button"
            onClick={() => topCardRef.current?.swipe('left')}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ border: '2px solid #fee2e2' }}
          >
            <X size={24} style={{ color: 'var(--accent)' }} />
          </button>
          <button
            type="button"
            onClick={() => topCardRef.current?.swipe('right')}
            className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{ border: '2px solid var(--bg-light)' }}
          >
            <Heart size={24} style={{ color: 'var(--primary)' }} />
          </button>
        </div>
      )}
    </div>
  );
}
