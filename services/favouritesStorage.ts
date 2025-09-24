import AsyncStorage from "@react-native-async-storage/async-storage";
import { WordDefinition } from "./api";

const FAVORITES_KEY = "@word_app_favorites";

export interface FavoriteWord extends WordDefinition {
  dateAdded: string;
  id: string;
}

export const getFavorites = async (): Promise<FavoriteWord[]> => {
  try {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};

export const addToFavorites = async (word: WordDefinition): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const favoriteWord: FavoriteWord = {
      ...word,
      dateAdded: new Date().toISOString(),
      id: `${word.word}_${Date.now()}`, // Unique ID in case of duplicates
    };

    // Check if word already exists (by word text)
    const exists = favorites.some(
      (fav) => fav.word.toLowerCase() === word.word.toLowerCase()
    );

    if (!exists) {
      const updatedFavorites = [favoriteWord, ...favorites]; // Add to beginning
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

export const removeFromFavorites = async (wordText: string): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(
      (fav) => fav.word.toLowerCase() !== wordText.toLowerCase()
    );
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

export const isFavorite = async (wordText: string): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(
      (fav) => fav.word.toLowerCase() === wordText.toLowerCase()
    );
  } catch (error) {
    console.error("Error checking if favorite:", error);
    return false;
  }
};

export const clearAllFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error("Error clearing favorites:", error);
    throw error;
  }
};
