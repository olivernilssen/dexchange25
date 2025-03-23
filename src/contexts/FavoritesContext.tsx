import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// The type of our stored favorites - session IDs with their day index
type StoredFavorites = {
  [sessionId: string]: {
    dayIndex: number;
  }
};

// Context interface
interface FavoritesContextType {
  favorites: StoredFavorites;
  addFavorite: (sessionId: string, dayIndex: number) => void;
  removeFavorite: (sessionId: string) => void;
  isFavorite: (sessionId: string) => boolean;
}

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: {},
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

// Create a provider component
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<StoredFavorites>({});

  // Load favorites from localStorage on initial render
  useEffect(() => {
    const storedFavorites = localStorage.getItem('sessionFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage:', e);
      }
    }
  }, []);

  // Update localStorage when favorites change
  useEffect(() => {
    localStorage.setItem('sessionFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a session to favorites
  const addFavorite = (sessionId: string, dayIndex: number) => {
    setFavorites(prev => ({
      ...prev,
      [sessionId]: { dayIndex }
    }));
  };

  // Remove a session from favorites
  const removeFavorite = (sessionId: string) => {
    setFavorites(prev => {
      const newFavorites = { ...prev };
      delete newFavorites[sessionId];
      return newFavorites;
    });
  };

  // Check if a session is favorited
  const isFavorite = (sessionId: string): boolean => {
    return !!favorites[sessionId];
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Export the useFavorites hook at the module level
export const useFavorites = () => useContext(FavoritesContext);