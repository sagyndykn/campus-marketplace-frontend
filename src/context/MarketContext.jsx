import { createContext, useContext, useState, useCallback } from 'react';

const MarketContext = createContext(null);

export function MarketProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = useCallback((listing) => {
    setWishlist((prev) => prev.find((i) => i.id === listing.id) ? prev : [...prev, listing]);
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = useCallback((id) => {
    return wishlist.some((i) => i.id === id);
  }, [wishlist]);

  return (
    <MarketContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);
