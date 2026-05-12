import { createContext, useContext } from 'react';

export interface FavoritesContextValue {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  clearFavorites: () => void;
}

export const FavoritesContext = createContext<FavoritesContextValue>({} as FavoritesContextValue);

export const useFavorites = () => useContext(FavoritesContext);
