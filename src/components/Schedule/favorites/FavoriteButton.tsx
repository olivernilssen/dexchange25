import { useState, useEffect, useCallback } from 'react';
import { useFavorites } from '../../../contexts/FavoritesContext';
import { Session } from '../../../types/schedule';

interface FavoriteButtonProps {
  session: Session;
  dayIndex: number;  // We'll still keep this in props for future use if needed
  className?: string;
  isInConnectedGroup?: boolean;
  connectedSessions?: Session[];
}

export default function FavoriteButton({ 
  session, 
  dayIndex, 
  className = '',
  isInConnectedGroup = false,
  connectedSessions = []
}: FavoriteButtonProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const sessionId = `${session.title}-${session.start}`;
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the session is a favorite
  useEffect(() => {
    setIsFavorite(!!favorites[sessionId]);
  }, [favorites, sessionId]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from triggering
    
    // Remember current scroll position before any changes
    const scrollPosition = window.scrollY;
    
    if (isInConnectedGroup && connectedSessions.length > 0) {
      // Handle all sessions in the group
      if (isFavorite) {
        // Remove all connected sessions from favorites
        connectedSessions.forEach(connectedSession => {
          const connectedId = `${connectedSession.title}-${connectedSession.start}`;
          removeFavorite(connectedId);
        });
      } else {
        // Add all connected sessions to favorites
        connectedSessions.forEach(connectedSession => {
          const connectedId = `${connectedSession.title}-${connectedSession.start}`;
          addFavorite(connectedId, dayIndex); // Add dayIndex as second parameter
        });
      }
    } else {
      // Handle single session
      if (isFavorite) {
        removeFavorite(sessionId);
      } else {
        addFavorite(sessionId, dayIndex); // Add dayIndex as second parameter
      }
    }
    
    // Restore scroll position after state updates
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  }, [isFavorite, addFavorite, removeFavorite, sessionId, dayIndex, isInConnectedGroup, connectedSessions]);

  return (
    <button 
      onClick={handleFavoriteClick}
      className={`text-2xl text-yellow-500 hover:text-yellow-600 ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
}