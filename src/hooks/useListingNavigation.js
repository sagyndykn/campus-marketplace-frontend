import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useListingNavigation(listing) {
  const navigate = useNavigate();
  const listingId = listing?.id;

  return useCallback(() => {
    if (listingId == null) return;
    navigate(`/listings/${listingId}`);
  }, [navigate, listingId]);
}

export function handleListingCardKeyDown(event, openListing) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openListing();
}
