"use client";

import { useState } from 'react';
import { Day, Session } from '../../types/schedule';
import { formatTime, getTagColor, getTimeFromString } from '../../utils/timeUtils';
import NextSessionsButton from './NextSessionsButton';
import { useUpcomingSessions } from '../../hooks/useUpcomingSessions';
import ConnectedSessionsCard from './ConnectedSessionsCard';
import SessionModal from './SessionModal';
import SessionCard from './SessionCard';

interface NextSessionsProps {
  day: Day;
  dayIndex: number;
  onSessionClick: (session: Session & { room?: string }) => void;
  currentTime?: string;
}

export default function NextSessions({ day, dayIndex, currentTime }: NextSessionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);
  const [selectedConnectedSessions, setSelectedConnectedSessions] = useState<(Session & { room?: string })[] | null>(null);
  const { nextSessions, sessionsByRoom, sortedRooms } = useUpcomingSessions(day, currentTime);
  
  // If no upcoming sessions, don't show anything
  if (nextSessions.length === 0) {
    return null;
  }
  
  // Handle regular session click
  const handleSessionClick = (session: Session & { room?: string }) => {
    setSelectedSession(session);
    setSelectedConnectedSessions(null);
  };
  
  // Handle connected sessions click
  const handleConnectedSessionsClick = (sessions: (Session & { room?: string })[]) => {
    setSelectedConnectedSessions(sessions);
    setSelectedSession(null);
  };
  
  // Handle closing the session modals
  const handleCloseSessionModal = () => {
    setSelectedSession(null);
    setSelectedConnectedSessions(null);
  };
  
  // Check if sessions are connected (one starts when the other ends)
  const areSessionsConnected = (sessions: Session[]) => {
    if (sessions.length <= 1) return false;
    
    // Sort sessions by start time
    const sortedSessions = [...sessions].sort((a, b) => 
      getTimeFromString(a.start) - getTimeFromString(b.start)
    );
    
    // Check if any session starts when the previous one ends
    for (let i = 1; i < sortedSessions.length; i++) {
      if (sortedSessions[i-1].end === sortedSessions[i].start) {
        return true;
      }
    }
    
    return false;
  };
  
  return (
    <>
      {/* Button to open modal */}
      <NextSessionsButton 
        count={nextSessions.length} 
        onClick={() => setIsOpen(true)}
      />
      
      {/* Modal with session details - wider on desktop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full sm:w-5/6 md:w-4/5 lg:w-3/4 xl:w-2/3 sm:rounded-lg rounded-none 
                          max-h-[100vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
            <div className="sticky top-0 bg-[#081079] text-white p-4 flex justify-between items-center z-10">
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
              
              {/* Rooms grid - vertical on mobile, horizontal on larger screens */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {sortedRooms.map(roomName => {
                  const sessions = sessionsByRoom[roomName];
                  const isConnected = areSessionsConnected(sessions);
                  
                  return (
                    <div key={roomName} className="h-full border border-gray-200 rounded-lg overflow-hidden">
                      {/* Room header */}
                      <div className="border-b border-l-[#081079] text-[#081079] py-2 px-4 font-bold">
                        {/* Display correct room name for common sessions based on day */}
                        {roomName === 'Felles' 
                          ? (dayIndex === 0 ? 'Arena' : 'Storsalen')
                          : roomName
                        } 
                        {sessions.length > 1 && (
                          <span className="ml-2 text-sm bg-white border border-[#081079] text-[#081079] rounded-full px-2 py-0.5">
                            {sessions.length} aktiviteter
                          </span>
                        )}
                      </div>
                      
                      {/* Sessions - use ConnectedSessionsCard for connected sessions */}
                      <div className="p-3 h-full">
                        {isConnected ? (
                          <ConnectedSessionsCard
                            sessions={sessions}
                            onClick={(session) => {
                              setSelectedSession(session);
                              setSelectedConnectedSessions(sessions);
                            }}
                            isCommon={roomName === 'Felles'}
                            dayIndex={dayIndex}
                            showRoom={false}
                          />
                        ) : (
                          // Grid layout for individual sessions
                          <div className="grid gap-3 grid-cols-1">
                            {!isConnected && sessions.map((session, index) => (
                              <SessionCard
                                key={index}
                                session={session}
                                onClick={handleSessionClick}
                                isCommon={roomName === 'Felles'}
                                dayIndex={dayIndex}
                                isCompleted={false}
                                showRoom={false}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
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
      
      {/* Session detail modal - for individual sessions */}
      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={handleCloseSessionModal} 
        />
      )}
    </>
  );
}