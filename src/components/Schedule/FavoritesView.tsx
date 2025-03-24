import { useState, useMemo } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Day, Session, ScheduleData } from '../../types/schedule';
import SessionCard from './SessionCard';
import SessionModal from './SessionModal';

interface FavoritesViewProps {
  scheduleData: ScheduleData;
  isSessionCompleted: (session: Session) => boolean;
}

export default function FavoritesView({ scheduleData, isSessionCompleted }: FavoritesViewProps) {
  const { favorites } = useFavorites();
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);

  // Group favorited sessions by day
  const favoritedSessionsByDay = useMemo(() => {
    const sessionsByDay: {[dayIndex: number]: Array<Session & { room?: string }>} = [];
    
    // Go through the schedule data and find favorited sessions
    scheduleData.schedule.days.forEach((day, dayIndex) => {
      sessionsByDay[dayIndex] = [];
      
      // Check room sessions
      if (day.tracks) {
        day.tracks.forEach(track => {
          if (track.sessions) {
            track.sessions.forEach(session => {
              const sessionId = `${session.title}-${session.start}`;
              if (favorites[sessionId]) {
                sessionsByDay[dayIndex].push({ ...session, room: track.room });
              }
            });
          }
        });
      }
      
      // Check common sessions
      if (day.commonSessions) {
        day.commonSessions.forEach(session => {
          const sessionId = `${session.title}-${session.start}`;
          if (favorites[sessionId]) {
            sessionsByDay[dayIndex].push({ ...session, room: 'All Rooms' });
          }
        });
      }
      
      // Remove empty days
      if (sessionsByDay[dayIndex].length === 0) {
        delete sessionsByDay[dayIndex];
      }
    });
    
    return sessionsByDay;
  }, [scheduleData, favorites]);

  const handleSessionClick = (session: Session & { room?: string }) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  // Calculate total number of favorites
  const totalFavorites = Object.values(favoritedSessionsByDay).reduce(
    (sum, sessions) => sum + sessions.length, 
    0
  );

  if (totalFavorites === 0) {
    return (
      <div className="mt-4 p-8 bg-white border border-gray-200 rounded-lg text-center">
        <div className="text-6xl mb-4">☆</div>
        <h3 className="text-xl font-bold text-[#081079] mb-2">Ingen favoritter enda</h3>
        <p className="text-gray-600">
          Klikk på stjerneikonet i øvre høyre hjørne av en aktivitet for å legge den til i favoritter.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="space-y-6">
        {/* Render each day that has favorites */}
        {Object.keys(favoritedSessionsByDay).map((dayIndexStr) => {
          const dayIndex = parseInt(dayIndexStr);
          const sessions = favoritedSessionsByDay[dayIndex];
          
          return (
            <div key={dayIndex} className="border border-[#8991cd] rounded-lg overflow-hidden">
              {/* Day header */}
              <div className="bg-[#081079] text-white py-2 px-4 font-bold text-lg">
                Dag {dayIndex + 1} 
                <span className="ml-2 text-sm bg-white text-[#081079] rounded-full px-2 py-0.5">
                  {sessions.length} aktiviteter
                </span>
              </div>
              
              <div className="p-4 bg-white">
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div key={index} className="relative">
                      <div className="pl-8">
                        <div className="mb-1">
                          <span className="text-sm font-medium text-[#6c7cbc]">
                            {session.room}
                          </span>
                        </div>
                        <SessionCard
                          session={session}
                          onClick={handleSessionClick}
                          dayIndex={dayIndex}
                        />
                        {isSessionCompleted(session) && (
                          <span className="text-green-500 ml-2">(Completed)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Session Modal */}
      <SessionModal 
        session={selectedSession} 
        onClose={closeModal} 
      />
    </div>
  );
}