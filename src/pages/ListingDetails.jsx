import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Loader, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getListing } from '../api/listings';
import { startConversation } from '../api/chat';
import AuthorListings from '../components/listing/AuthorListings';
import SimilarListings from '../components/listing/SimilarListings';

const SWIPE_THRESHOLD = 50;

function PhotoCarousel({ photos }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const dragStartX = useRef(0);

  const go = (next) => {
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  const prev = () => index > 0 && go(index - 1);
  const next = () => index < photos.length - 1 && go(index + 1);

  const handleDragStart = (e) => {
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e) => {
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - endX;
    if (diff > SWIPE_THRESHOLD) next();
    else if (diff < -SWIPE_THRESHOLD) prev();
  };

  if (photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <span className="text-sm text-gray-400">Нет фото</span>
      </div>
    );
  }

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative overflow-hidden bg-gray-100 dark:bg-gray-800 select-none cursor-grab active:cursor-grabbing"
      style={{ aspectRatio: '4/3' }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      {/* slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={photos[index]}
          alt=""
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
      </AnimatePresence>

      {/* arrow buttons — desktop only */}
      {index > 0 && (
        <button
          type="button"
          onClick={prev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          type="button"
          onClick={next}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* dots */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => go(i)}
              className="rounded-full transition-all"
              style={{
                width: i === index ? 20 : 6,
                height: 6,
                backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}

      {/* counter badge */}
      {photos.length > 1 && (
        <span className="absolute top-3 right-3 z-10 text-xs font-medium text-white bg-black/40 rounded-full px-2 py-0.5">
          {index + 1} / {photos.length}
        </span>
      )}
    </div>
  );
}

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    setLoading(true);
    getListing(id)
      .then((data) => setListing(data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChat = async () => {
    if (!listing?.sellerId) return;
    setStartingChat(true);
    try {
      const conv = await startConversation(listing.sellerId, listing.id);
      navigate(`/chat/${conv.id}`, { state: { otherUserId: conv.otherUserId, otherUserName: conv.otherUserName } });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStartingChat(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button type="button" onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium mb-6"
          style={{ color: 'var(--primary)' }}>
          <ArrowLeft size={16} /> {t('common.back')}
        </button>
        <p className="text-lg font-semibold" style={{ color: 'var(--primary)' }}>
          {t('feed.notFound')}
        </p>
      </div>
    );
  }

  const photos = listing.photoUrls || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-24 md:pb-8">
      <button type="button" onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium mb-4"
        style={{ color: 'var(--primary)' }}>
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <PhotoCarousel photos={photos} />
        </section>

        <aside className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm h-fit">
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}>
            {t('categories.' + listing.category, { defaultValue: listing.category })}
          </span>

          <h1 className="text-2xl font-bold mt-3 leading-tight" style={{ color: 'var(--primary)' }}>
            {listing.title}
          </h1>

          <p className="text-2xl font-bold mt-3" style={{ color: 'var(--accent)' }}>
            {listing.price?.toLocaleString('ru-RU')} ₸
          </p>

          {listing.description && (
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-300 mt-4 whitespace-pre-line">
              {listing.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
            {listing.sellerAvatarUrl ? (
              <img src={listing.sellerAvatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: 'var(--accent)' }}>
                <User size={18} />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                {listing.sellerName || t('listing.anonymous')}
              </p>
              {listing.createdAt && (
                <p className="text-xs text-gray-400">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          <button type="button" onClick={handleChat}
            disabled={startingChat || !listing.sellerId}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-5 py-3 rounded-xl text-sm font-medium disabled:opacity-60">
            {startingChat ? <Loader size={16} className="animate-spin" /> : <MessageCircle size={16} />}
            {t('listing.write')}
          </button>
        </aside>
      </div>

      <AuthorListings listing={listing} />
      <SimilarListings listing={listing} />
    </div>
  );
}
