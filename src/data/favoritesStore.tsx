import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { FavoritesContext, type FavoritesContextValue } from './favoritesContext';

const STORAGE_KEY = 'gh_favorites';

function readFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteIds,
    isFavorite: (id) => favoriteIds.includes(id),
    toggleFavorite: (id) => {
      setFavoriteIds((current) => (
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id]
      ));
    },
    clearFavorites: () => setFavoriteIds([]),
  }), [favoriteIds]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
