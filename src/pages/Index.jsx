import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMarket } from '../context/MarketContext';
import { getListings, addFavorite, removeFavorite, getFavorites } from '../api/listings';
import { startConversation } from '../api/chat';
import { toast } from 'sonner';

import FeedHeader from '../components/feed/FeedHeader';
import FiltersModal from '../components/feed/FiltersModal';
import FeedSkeletonLoader from '../components/feed/FeedSkeletonLoader';
import ListingGrid from '../components/listings/ListingGrid';
import ListingList from '../components/listings/ListingList';
import ListingTileGrid from '../components/listings/ListingTileGrid';
import ListingSwipe from '../components/listings/ListingSwipe';
import Pagination from '../components/common/Pagination';

const PAGE_SIZE = 20;
const DEBOUNCE_MS = 300;
const VIEW_MODE_KEY = 'feed_view_mode';
const EMPTY_FILTERS = { minPrice: '', maxPrice: '', onlyWithPhoto: false };

function normalizeSearch(str) {
  return str.toLowerCase().trim();
}

function matchesSearch(listing, query) {
  if (!query) return true;
  const q = normalizeSearch(query);
  return (
    normalizeSearch(listing.title || '').includes(q) ||
    normalizeSearch(listing.description || '').includes(q)
  );
}

function sortListings(listings, sort) {
  if (!sort || sort === 'recommended') return listings;
  const sorted = [...listings];
  if (sort === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sort === 'cheapest') sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  else if (sort === 'expensive') sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
  return sorted;
}

function readViewMode() {
  const raw = localStorage.getItem(VIEW_MODE_KEY);
  if (raw === 'grid') return 'gallery'; // migrate old value
  return raw || 'gallery';
}

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToWishlist } = useMarket();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recommended');
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const [viewMode, setViewMode] = useState(readViewMode);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (viewMode !== 'swipe') return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [viewMode]);

  useEffect(() => {
    setPage(0);
    setSwipeIndex(0);
  }, [debouncedSearch, category, filters.minPrice, filters.maxPrice, filters.onlyWithPhoto]);

  useEffect(() => {
    setLoading(true);
    setSwipeIndex(0);
    const params = { page, size: PAGE_SIZE };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category) params.category = category;
    if (filters.minPrice !== '') params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice !== '') params.maxPrice = Number(filters.maxPrice);
    getListings(params)
      .then((response) => {
        const content = response.content || [];
        setListings(content);
        setTotalPages(Math.max(response.totalPages || 1, 1));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [debouncedSearch, category, filters.minPrice, filters.maxPrice, page]);

  useEffect(() => {
    getFavorites()
      .then((favs) => setFavoritedIds(new Set((favs || []).map((l) => l.id))))
      .catch(() => {});
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_KEY, mode);
    if (mode === 'swipe') setSwipeIndex(0);
  }, []);

  const handlePageChange = useCallback((nextPage) => {
    const safePage = Math.min(Math.max(nextPage, 0), totalPages - 1);
    if (safePage === page) return;

    setPage(safePage);
    setSwipeIndex(0);

    if (viewMode !== 'swipe') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page, totalPages, viewMode]);

  const displayedListings = useMemo(() => {
    let result = listings;
    if (debouncedSearch) result = result.filter((l) => matchesSearch(l, debouncedSearch));
    if (filters.onlyWithPhoto) result = result.filter((l) => l.photoUrls?.length > 0);
    return sortListings(result, sort);
  }, [listings, debouncedSearch, sort, filters.onlyWithPhoto]);

  const hasActiveFilters = filters.minPrice !== '' || filters.maxPrice !== '' || filters.onlyWithPhoto;

  const handleToggleFavorite = useCallback(async (listing) => {
    const wasFav = favoritedIds.has(listing.id);
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      wasFav ? next.delete(listing.id) : next.add(listing.id);
      return next;
    });
    try {
      if (wasFav) await removeFavorite(listing.id);
      else await addFavorite(listing.id);
    } catch {
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        wasFav ? next.add(listing.id) : next.delete(listing.id);
        return next;
      });
      toast.error(t('wishlist.failUpdate'));
    }
  }, [favoritedIds, t]);

  const handleSwipe = useCallback((direction) => {
    if (direction === 'right') {
      const listing = displayedListings[swipeIndex];
      if (listing) {
        addToWishlist(listing);
        if (!favoritedIds.has(listing.id)) {
          handleToggleFavorite(listing);
        }
        toast.success(t('wishlist.added'), { duration: 1500 });
      }
    }
    const nextIndex = swipeIndex + 1;
    if (nextIndex >= displayedListings.length && page < totalPages - 1) {
      setPage((currentPage) => Math.min(currentPage + 1, totalPages - 1));
    } else {
      setSwipeIndex(nextIndex);
    }
  }, [displayedListings, swipeIndex, page, totalPages, favoritedIds, addToWishlist, handleToggleFavorite, t]);

  const handleChat = useCallback(async (listing) => {
    try {
      const conv = await startConversation(listing.sellerId, listing.id);
      navigate(`/chat/${conv.id}`, { state: { otherUserId: conv.otherUserId, otherUserName: conv.otherUserName } });
    } catch (err) {
      toast.error(err.message);
    }
  }, [navigate]);

  const renderContent = () => {
    if (loading) return <FeedSkeletonLoader viewMode={viewMode} />;

    if (displayedListings.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-lg font-bold" style={{ color: 'var(--primary)' }}>{t('feed.noResultsTitle')}</p>
          <p className="text-sm text-gray-400">{t('feed.noResultsDesc')}</p>
        </div>
      );
    }

    const sharedProps = {
      items: displayedListings,
      favoritedIds,
      onFavoriteToggle: handleToggleFavorite,
      onChat: handleChat,
    };

    if (viewMode === 'swipe') {
      return (
        <ListingSwipe
          listings={displayedListings}
          swipeIndex={swipeIndex}
          onSwipe={handleSwipe}
          onChat={handleChat}
          onReset={() => setSwipeIndex(0)}
        />
      );
    }
    if (viewMode === 'list') return <ListingList {...sharedProps} />;
    if (viewMode === 'tile') return <ListingTileGrid {...sharedProps} />;
    return <ListingGrid {...sharedProps} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <FeedHeader
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFiltersOpen={() => setFiltersOpen(true)}
        resultCount={displayedListings.length}
        loading={loading}
        hasActiveFilters={hasActiveFilters}
      />

      <div className={viewMode === 'swipe' ? '' : 'max-w-7xl mx-auto px-4 py-4 pb-24 md:pb-8'}>
        {renderContent()}
        {!loading && viewMode !== 'swipe' && (
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        )}
      </div>

      <FiltersModal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  );
}
