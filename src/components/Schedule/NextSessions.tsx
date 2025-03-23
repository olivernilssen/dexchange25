import { useState, useEffect } from 'react';
import { formatTime, getTimeFromString } from '../../utils/timeUtils';
import { Day, Session } from '../../types/schedule';
import FavoriteButton from './FavoriteButton';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';
import NextSessionsButton from './NextSessionsButton';

// Update the props interface to include the dayIndex
interface NextSessionsProps {
  day: Day;
  dayIndex: number; // Add this
  onSessionClick: (session: Session & { room?: string }) => void;
  currentTime?: string; // For testing - override current time
}

export default function NextSessions({ day, dayIndex, onSessionClick, currentTime }: NextSessionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nextSessions, setNextSessions] = useState<Array<Session & { room: string }>>([]);
  const [sessionsByRoom, setSessionsByRoom] = useState<{[key: string]: Array<Session & { room: string }>}>({});
  
  // Function to find upcoming sessions
  const findUpcomingSessions = () => {
    if (!day || !day.tracks) return [];
    
    // Get current time in minutes (e.g., 9:30 AM = 570 minutes)
    let now: number;
    
    if (currentTime) {
      // Use provided time for testing
      now = getTimeFromString(currentTime);
    } else {
      // Use actual current time
      const date = new Date();
      now = date.getHours() * 60 + date.getMinutes();
    }
    
    console.log(`Current time: ${Math.floor(now/60)}:${now%60}`);
    
    // Collect all sessions with their rooms
    const allSessions: Array<Session & { room: string }> = [];
    
    // Add room sessions
    day.tracks.forEach(track => {
      if (track.sessions) {
        track.sessions.forEach(session => {
          allSessions.push({
            ...session,
            room: track.room
          });
        });
      }
    });
    
    // Add common sessions
    if (day.commonSessions) {
      day.commonSessions.forEach(session => {
        allSessions.push({
          ...session,
          room: "All Rooms"
        });
      });
    }
    
    // Find sessions that haven't started yet
    const upcomingSessions = allSessions.filter(session => {
      const startTime = getTimeFromString(session.start);
      return startTime > now;
    });
    
    // Sort by start time
    upcomingSessions.sort((a, b) => {
      return getTimeFromString(a.start) - getTimeFromString(b.start);
    });
    
    // Get the next time slot (sessions that start at the same time)
    if (upcomingSessions.length > 0) {
      const nextStartTime = getTimeFromString(upcomingSessions[0].start);
      
      // Get all sessions starting within the next 30 minutes from the first upcoming session
      return upcomingSessions.filter(session => {
        const startTime = getTimeFromString(session.start);
        // Include sessions that start at the same time or up to 30 mins later
        return startTime <= (nextStartTime + 30);
      });
    }
    
    return [];
  };
  
  // Group sessions by room
  const groupSessionsByRoom = (sessions: Array<Session & { room: string }>) => {
    const grouped: {[key: string]: Array<Session & { room: string }>} = {};
    
    sessions.forEach(session => {
      if (!grouped[session.room]) {
        grouped[session.room] = [];
      }
      grouped[session.room].push(session);
    });
    
    return grouped;
  };
  
  // Update next sessions every minute
  useEffect(() => {
    const updateSessions = () => {
      const upcoming = findUpcomingSessions();
      setNextSessions(upcoming);
      setSessionsByRoom(groupSessionsByRoom(upcoming));
    };
    
    // Initial update
    updateSessions();
    
    // Set interval to check every minute
    const intervalId = setInterval(updateSessions, 60000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [day, currentTime]);
  
  // If no upcoming sessions, don't show the button
  if (nextSessions.length === 0) {
    return null;
  }
  
  // Sort rooms to show rooms with multiple sessions first
  const sortedRooms = Object.keys(sessionsByRoom).sort((a, b) => {
    // Sort by number of sessions (descending)
    return sessionsByRoom[b].length - sessionsByRoom[a].length;
  });
  
  return (
    <>
      {/* Use the NextSessionsButton component */}
      <NextSessionsButton 
        count={nextSessions.length} 
        onClick={() => setIsOpen(true)}
      />
      
      {/* Modal for showing next sessions */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-lg rounded-none max-h-[100vh] sm:max-h-[80vh] flex flex-col overflow-hidden shadow-xl">
            <div className="sticky top-0 bg-[#081079] text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold">Kommende aktiviteter</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
                aria-label="Lukk"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              <div className="text-center mb-4">
                <p className="text-[#081079] font-medium">
                  Aktiviteter som starter {formatTime(nextSessions[0].start)} eller like etter:
                </p>
              </div>
              
              <div className="space-y-6">
                {sortedRooms.map(roomName => (
                  <div key={roomName} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Room header - more prominent */}
                    <div className="bg-[#081079] text-white py-2 px-4 font-bold">
                      {roomName} 
                      {sessionsByRoom[roomName].length > 1 && (
                        <span className="ml-2 text-sm bg-white text-[#081079] rounded-full px-2 py-0.5">
                          {sessionsByRoom[roomName].length} aktiviteter
                        </span>
                      )}
                    </div>
                    
                    {/* Sessions in this room */}
                    <div className="divide-y divide-gray-100">
                      {sessionsByRoom[roomName].map((session, sessionIndex) => {
                        const isWorkshop = session.kind === 'workshop';
                        
                        return (
                          <div
                            key={sessionIndex}
                            onClick={() => {
                              onSessionClick(session);
                              setIsOpen(false);
                            }}
                            className={`relative p-3 cursor-pointer hover:bg-gray-50 transition-all ${
                              isWorkshop 
                                ? 'border-l-4 border-[#e05252]' 
                                : 'border-l-4 border-[#3949ab]'
                            }`}
                          >
                            {/* Use the FavoriteButton component */}
                            <FavoriteButton 
                              session={session} 
                              dayIndex={dayIndex}  
                              className="absolute top-2 right-2" 
                            />
                            
                            <div className="font-bold text-[#333333] pr-8">{session.title}</div>
                            
                            <div className="flex justify-between items-center mt-1">
                              <div className={isWorkshop ? "text-[#b73939]" : "text-[#3949ab]"}>
                                {formatTime(session.start)} - {formatTime(session.end)}
                              </div>
                              
                              {/* Use the SessionTypeBadge component */}
                              {session.kind && <SessionTypeBadge type={session.kind} />}
                            </div>
                            
                            {session.speaker && (
                              <div className="text-[#333333] mt-1">{session.speaker}</div>
                            )}
                            
                            {/* Use the SessionTags component */}
                            {session.tag && <SessionTags tags={session.tag} className="mt-2" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#081079] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#060d4d] transition-colors"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}