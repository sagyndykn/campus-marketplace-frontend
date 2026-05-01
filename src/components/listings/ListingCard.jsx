import { Heart, MessageCircle } from 'lucide-react';
import { CATEGORY_LABELS } from '../../data/listings';

function HeartButton({ isFavorited, onClick, size = 'md' }) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 11 : 15;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`${dim} rounded-full bg-white shadow flex items-center justify-center transition-transform hover:scale-110 active:scale-95 flex-shrink-0`}
    >
      <Heart
        size={iconSize}
        fill={isFavorited ? 'currentColor' : 'none'}
        style={{ color: isFavorited ? 'var(--accent)' : '#9ca3af' }}
      />
    </button>
  );
}

export function GalleryCard({ listing, isFavorited, onFavoriteToggle, onChat }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => onChat?.(listing)}
    >
      <div className="relative overflow-hidden" style={{ height: 180, backgroundColor: 'var(--bg-light)' }}>
        {listing.photoUrls?.length > 0 ? (
          <img
            src={listing.photoUrls[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl opacity-20 select-none">📦</div>
        )}
        <div className="absolute top-2 right-2 z-10">
          <HeartButton isFavorited={isFavorited} onClick={() => onFavoriteToggle(listing)} />
        </div>
      </div>
      <div className="p-3">
        <span
          className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}
        >
          {CATEGORY_LABELS[listing.category] || listing.category}
        </span>
        <h3 className="font-semibold text-sm mt-1.5 line-clamp-2 leading-snug" style={{ color: 'var(--primary)' }}>
          {listing.title}
        </h3>
        <p className="font-bold text-sm mt-1" style={{ color: 'var(--accent)' }}>
          {listing.price?.toLocaleString('ru-RU')} ₸
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {listing.sellerAvatarUrl ? (
              <img src={listing.sellerAvatarUrl} className="w-5 h-5 rounded-full object-cover flex-shrink-0" alt="" />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {(listing.sellerName || '?')[0].toUpperCase()}
              </div>
            )}
            <span className="text-xs text-gray-400 truncate">{listing.sellerName || 'Аноним'}</span>
          </div>
          {onChat && (
            <button
              onClick={(e) => { e.stopPropagation(); onChat(listing); }}
              className="ml-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              <MessageCircle size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ListCard({ listing, isFavorited, onFavoriteToggle, onChat }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex group cursor-pointer">
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: 150, backgroundColor: 'var(--bg-light)' }}
        onClick={() => onChat?.(listing)}
      >
        {listing.photoUrls?.length > 0 ? (
          <img
            src={listing.photoUrls[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            style={{ height: 120 }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center text-3xl opacity-20 select-none"
            style={{ height: 120 }}
          >
            📦
          </div>
        )}
      </div>
      <div
        className="flex-1 p-3 flex flex-col justify-between min-w-0"
        onClick={() => onChat?.(listing)}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span
                className="inline-block text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}
              >
                {CATEGORY_LABELS[listing.category] || listing.category}
              </span>
              <h3 className="font-semibold text-sm mt-1 line-clamp-2 leading-snug" style={{ color: 'var(--primary)' }}>
                {listing.title}
              </h3>
            </div>
            <HeartButton isFavorited={isFavorited} onClick={() => onFavoriteToggle(listing)} />
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{listing.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-sm" style={{ color: 'var(--accent)' }}>
            {listing.price?.toLocaleString('ru-RU')} ₸
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block truncate max-w-24">
              {listing.sellerName || 'Аноним'}
            </span>
            {onChat && (
              <button
                onClick={(e) => { e.stopPropagation(); onChat(listing); }}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
                style={{ backgroundColor: 'var(--bg-light)', color: 'var(--primary)' }}
              >
                <MessageCircle size={12} /> Написать
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TileCard({ listing, isFavorited, onFavoriteToggle, onChat }) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => onChat?.(listing)}
    >
      <div className="relative overflow-hidden" style={{ height: 110, backgroundColor: 'var(--bg-light)' }}>
        {listing.photoUrls?.length > 0 ? (
          <img
            src={listing.photoUrls[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-20 select-none">📦</div>
        )}
        <div className="absolute top-1 right-1 z-10">
          <HeartButton isFavorited={isFavorited} onClick={() => onFavoriteToggle(listing)} size="sm" />
        </div>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-xs line-clamp-2 leading-snug" style={{ color: 'var(--primary)' }}>
          {listing.title}
        </h3>
        <p className="font-bold text-xs mt-1" style={{ color: 'var(--accent)' }}>
          {listing.price?.toLocaleString('ru-RU')} ₸
        </p>
      </div>
    </div>
  );
}
