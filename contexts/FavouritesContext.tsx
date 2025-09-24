import React, { createContext, useContext, useEffect, useState } from "react";
import { WordDefinition } from "../services/api";
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  FavoriteWord,
} from "../services/favouritesStorage";

interface FavoritesContextType {
  favorites: FavoriteWord[];
  isWordFavorited: (word: string) => boolean;
  toggleFavorite: (word: WordDefinition) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = async () => {
    try {
      const favs = await getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, []);

  const isWordFavorited = (word: string): boolean => {
    return favorites.some(
      (fav) => fav.word.toLowerCase() === word.toLowerCase()
    );
  };

  const toggleFavorite = async (word: WordDefinition): Promise<void> => {
    try {
      const isFav = isWordFavorited(word.word);

      if (isFav) {
        await removeFromFavorites(word.word);
      } else {
        await addToFavorites(word);
      }

      await refreshFavorites();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isWordFavorited,
        toggleFavorite,
        refreshFavorites,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
