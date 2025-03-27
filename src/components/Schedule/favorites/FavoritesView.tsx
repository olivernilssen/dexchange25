import { useState, useMemo } from 'react';
import { useFavorites } from '../../../contexts/FavoritesContext';
import { getTimeFromString, formatTime } from '../../../utils/timeUtils';
import { Day, Session, ScheduleData } from '../../../types/schedule';
import SessionCard from '../cards/SessionCard';
import ConnectedSessionsCard from '../cards/ConnectedSessionsCard';
import SessionModal from '../SessionModal';
import ScrollManager from '../../ScrollManager';
import { getRoomNameForSession } from '@/config/rooms';

interface FavoriteSessionItem {
  session: Session & { room?: string; isCommon?: boolean };
  dayIndex: number;
  date: string;
  isConnectedGroup?: boolean;
  connectedSessions?: FavoriteSessionItem[];
}

interface FavoritesViewProps {
  scheduleData: ScheduleData;
  isSessionCompleted: (session: Session) => boolean;
}

export default function FavoritesView({ scheduleData, isSessionCompleted }: FavoritesViewProps) {
  const { favorites } = useFavorites();
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);

  // Get all favorited sessions
  const favoritedSessions = useMemo(() => {
    const allSessions: FavoriteSessionItem[] = [];
    
    // Go through the schedule data and find favorited sessions
    scheduleData.schedule.days.forEach((day, dayIndex) => {
      // Check room sessions
      if (day.tracks) {
        day.tracks.forEach(track => {
          if (track.sessions) {
            track.sessions.forEach(session => {
              const sessionId = `${session.title}-${session.start}`;
              if (favorites[sessionId]) {
                allSessions.push({
                  session: { ...session, room: track.room },
                  dayIndex,
                  date: day.date
                });
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
            allSessions.push({
              session: { ...session, room: 'Felles', isCommon: true },
              dayIndex,
              date: day.date
            });
          }
        });
      }
    });
    
    // Sort all sessions by day and time
    allSessions.sort((a, b) => {
      if (a.dayIndex !== b.dayIndex) {
        return a.dayIndex - b.dayIndex;
      }
      return getTimeFromString(a.session.start) - getTimeFromString(b.session.start);
    });
    
    return allSessions;
  }, [scheduleData, favorites]);

  const handleSessionClick = (session: Session & { room?: string }) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  // Find connected sessions in favorited sessions
  const { sessionsByDay, connectedGroupsByDay } = useMemo(() => {
    const sessionsByDay: Record<number, FavoriteSessionItem[]> = {};
    const connectedGroupsByDay: Record<number, FavoriteSessionItem[][]> = {};
    const processedItems = new Set<string>(); // Track ALL processed items
    
    // Group all sessions by day first
    favoritedSessions.forEach(item => {
      if (!sessionsByDay[item.dayIndex]) {
        sessionsByDay[item.dayIndex] = [];
        connectedGroupsByDay[item.dayIndex] = [];
      }
      sessionsByDay[item.dayIndex].push(item);
    });
    
    // For each day, find connected sessions
    Object.entries(sessionsByDay).forEach(([dayIndexStr, items]) => {
      const dayIndex = parseInt(dayIndexStr);
      
      // Group sessions by room
      const sessionsByRoom: Record<string, FavoriteSessionItem[]> = {};
      
      items.forEach(item => {
        const room = getRoomNameForSession(dayIndex, item.session.room || 'Ukjent');
        if (!sessionsByRoom[room]) {
          sessionsByRoom[room] = [];
        }
        sessionsByRoom[room].push(item);
      });
      
      // Find connected sessions in each room (except "Felles")
      Object.entries(sessionsByRoom).forEach(([room, roomSessions]) => {
        if (room === 'Felles' || roomSessions.length <= 1) return;
        
        // Sort by start time
        roomSessions.sort((a, b) => 
          getTimeFromString(a.session.start) - getTimeFromString(b.session.start)
        );
        
        // Find connected sessions
        const unprocessedSessions = [...roomSessions];
        
        while (unprocessedSessions.length > 0) {
          const currentGroup = [unprocessedSessions.shift()!];
          let lastSession = currentGroup[0];
          let expandedGroup = true;
          
          while (expandedGroup) {
            expandedGroup = false;
            
            for (let i = 0; i < unprocessedSessions.length; i++) {
              const nextSession = unprocessedSessions[i];
              
              // Check if connected
              if (nextSession.session.start === lastSession.session.end) {
                currentGroup.push(nextSession);
                lastSession = nextSession;
                unprocessedSessions.splice(i, 1);
                expandedGroup = true;
                break;
              }
            }
          }
          
          // Only add groups with multiple sessions
          if (currentGroup.length > 1) {
            connectedGroupsByDay[dayIndex].push(currentGroup);
            
            // Mark all sessions in this group as processed
            currentGroup.forEach(item => {
              const sessionKey = `${item.session.title}-${item.session.start}`;
              processedItems.add(sessionKey);
            });
          }
        }
      });
      
      // MOVED OUTSIDE THE INNER LOOP: Filter out ALL sessions that are part of ANY connected group
      sessionsByDay[dayIndex] = items.filter(item => {
        const sessionKey = `${item.session.title}-${item.session.start}`;
        return !processedItems.has(sessionKey);
      });
    });
    
    return { sessionsByDay, connectedGroupsByDay };
  }, [favoritedSessions]);

  if (favoritedSessions.length === 0) {
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
        <ScrollManager />
        {/* Render each day that has favorites */}
        {Object.entries(sessionsByDay).map(([dayIndexStr, items]) => {
          const dayIndex = parseInt(dayIndexStr);
          const connectedGroups = connectedGroupsByDay[dayIndex] || [];
          
          // First, add all connected groups as special items at their first session's time
          const allItems = [...items];
          
          connectedGroups.forEach(group => {
            // Sort group by start time
            group.sort((a, b) => 
              getTimeFromString(a.session.start) - getTimeFromString(b.session.start)
            );
            
            // Add a marker for this group with the first session's start time
            allItems.push({
              ...group[0],
              isConnectedGroup: true,
              connectedSessions: group
            });
          });
          
          // Sort all items by time
          allItems.sort((a, b) => 
            getTimeFromString(a.session.start) - getTimeFromString(b.session.start)
          );
          
          // Group the items by time
          const timeBlocks = allItems.reduce<Record<string, any[]>>((blocks, item) => {
            const time = formatTime(item.session.start);
            if (!blocks[time]) {
              blocks[time] = [];
            }
            blocks[time].push(item);
            return blocks;
          }, {});
          
          return (
            <div key={dayIndex} className="border border-[#8991cd] rounded-lg overflow-hidden">
              {/* Day header */}
              <div className="bg-[#081079] text-white py-2 px-4 font-bold text-lg">
                Dag {dayIndex + 1} 
                <span className="ml-2 text-sm bg-white text-[#081079] rounded-full px-2 py-0.5">
                  {favoritedSessions.filter(s => s.dayIndex === dayIndex).length} aktiviteter
                </span>
              </div>
              
              <div className="p-4 bg-white">
                <div className="space-y-4">
                  {/* Render each time block */}
                  {Object.entries(timeBlocks).map(([time, timeItems]) => (
                    <div key={time} className="time-block">
                      <h3 className="text-lg font-medium text-[#081079] border-b mb-2">
                        {time}
                      </h3>
                      
                      <div className="space-y-3 pl-2">
                        {timeItems.map((item, itemIndex) => {
                          if (item.isConnectedGroup) {
                            return (
                              <div key={`group-${itemIndex}`}>
                                <ConnectedSessionsCard
                                  sessions={item.connectedSessions.map((s: FavoriteSessionItem) => s.session)}
                                  onClick={handleSessionClick}
                                  isCommon={false}
                                  dayIndex={dayIndex}
                                  isCompleted={isSessionCompleted(item.session)}
                                  showRoom={true}
                                />
                              </div>
                            );
                          } else {
                            return (
                              <div key={`session-${itemIndex}`}>
                                <SessionCard
                                  session={item.session}
                                  onClick={handleSessionClick}
                                  dayIndex={dayIndex}
                                  isCommon={!!item.session.isCommon}
                                  isCompleted={isSessionCompleted(item.session)}
                                  showRoom={true}
                                />
                              </div>
                            );
                          }
                        })}
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