"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const FAVORITES_KEY = "rentazuela_favorites";

export interface UseFavoritesReturn {
  favorites: Set<string>;
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => void;
  addFavorite: (listingId: string) => void;
  removeFavorite: (listingId: string) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });
  const isHydrated = useRef(true);

  useEffect(() => {
    isHydrated.current = true;
  }, []);

  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (listingId: string) => favorites.has(listingId),
    [favorites]
  );

  const toggleFavorite = useCallback((listingId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });
  }, []);

  const addFavorite = useCallback((listingId: string) => {
    setFavorites((prev) => new Set(prev).add(listingId));
  }, []);

  const removeFavorite = useCallback((listingId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.delete(listingId);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    favoritesCount: favorites.size,
  };
}
