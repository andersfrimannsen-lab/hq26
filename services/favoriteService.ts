import type { Quote } from '../types';

const FAVORITES_KEY = 'hopeful-quotes-favorites';

export const loadFavorites = (): Quote[] => {
  try {
    const favoritesJson = localStorage.getItem(FAVORITES_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
  } catch (error) {
    console.error("Failed to load favorites from localStorage", error);
  }
  return [];
};

export const saveFavorites = (favorites: Quote[]): void => {
  try {
    const favoritesJson = JSON.stringify(favorites);
    localStorage.setItem(FAVORITES_KEY, favoritesJson);
  } catch (error) {
    console.error("Failed to save favorites to localStorage", error);
  }
};
