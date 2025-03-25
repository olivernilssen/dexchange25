"use client";

import { useState } from 'react';
import { Day, Session } from '../../types/schedule';
import { formatTime, getTagColor } from '../../utils/timeUtils';
import NextSessionsButton from './NextSessionsButton';
import { useUpcomingSessions } from '../../hooks/useUpcomingSessions';
import ConnectedSessionsCard from './ConnectedSessionsCard';
import FavoriteButton from './FavoriteButton';
import SessionModal from './SessionModal';

interface NextSessionsProps {
  day: Day;
  dayIndex: number;
  onSessionClick: (session: Session & { room?: string }) => void;
  currentTime?: string;
}

export default function NextSessions({ day, dayIndex, currentTime }: NextSessionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);
  const { nextSessions, sessionsByRoom, sortedRooms } = useUpcomingSessions(day, currentTime);
  
  // If no upcoming sessions, don't show anything
  if (nextSessions.length === 0) {
    return null;
  }
  
  // Handle session click within this component
  const handleSessionClick = (session: Session & { room?: string }) => {
    setSelectedSession(session);
  };
  
  // Handle closing the session modal
  const handleCloseSessionModal = () => {
    setSelectedSession(null);
  };
  
  return (
    <>
      {/* Button to open modal */}
      <NextSessionsButton 
        count={nextSessions.length} 
        onClick={() => setIsOpen(true)}
      />
      
      {/* Modal with session details */}
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
                    {/* Room header */}
                    <div className="bg-[#081079] text-white py-2 px-4 font-bold">
                      {/* Display correct room name for common sessions based on day */}
                      {roomName === 'Felles' 
                        ? (dayIndex === 0 ? 'Arena' : 'Storsalen')
                        : roomName
                      } 
                      {sessionsByRoom[roomName].length > 1 && (
                        <span className="ml-2 text-sm bg-white text-[#081079] rounded-full px-2 py-0.5">
                          {sessionsByRoom[roomName].length} aktiviteter
                        </span>
                      )}
                    </div>
                    
                    {/* If multiple sessions in this room, use ConnectedSessionsCard */}
                    {sessionsByRoom[roomName].length > 1 ? (
                      <div className="p-2">
                        <ConnectedSessionsCard
                          sessions={sessionsByRoom[roomName]}
                          onClick={handleSessionClick}
                          isCommon={roomName === 'Felles'}
                          dayIndex={dayIndex}
                          showRoom={false}
                        />
                      </div>
                    ) : (
                      // Single session display
                      <div className="divide-y divide-gray-100">
                        {sessionsByRoom[roomName].map((session, index) => {
                          const isWorkshop = session.kind === 'workshop';
                          const isCommon = roomName === 'Felles';
                          
                          return (
                            <div
                              key={index}
                              onClick={() => handleSessionClick(session)}
                              className={`relative p-3 cursor-pointer hover:bg-gray-50 transition-all ${
                                isCommon ? 'border-l-4 border-[#f0b429]' : 
                                isWorkshop ? 'border-l-4 border-[#e05252]' : 
                                'border-l-4 border-[#3949ab]'
                              }`}
                            >
                              {/* Favorite button */}
                              <FavoriteButton 
                                session={session} 
                                dayIndex={dayIndex}  
                                className="absolute top-2 right-2" 
                              />
                              
                              {/* Title */}
                              <div className="font-bold text-[#333333] pr-8">{session.title}</div>
                              
                              {/* Time and session type */}
                              <div className="flex justify-between items-center mt-1">
                                <div className={
                                  isCommon ? "text-[#b88a00]" :
                                  isWorkshop ? "text-[#e05252]" : 
                                  "text-[#3949ab]"
                                }>
                                  {formatTime(session.start)} - {formatTime(session.end)}
                                </div>
                              </div>
                              
                              {/* Speaker */}
                              {session.speaker && (
                                <div className="text-[#333333] mt-1">{session.speaker}</div>
                              )}
                              
                              {/* Session tags */}
                              <div className="flex flex-wrap items-center gap-1 mt-2">
                                {session.kind && (
                                  <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-medium ${
                                    isWorkshop ? 'bg-[#e05252] text-white' : 'bg-[#3949ab] text-white'
                                  }`}>
                                    {isWorkshop ? 'workshop' : 'foredrag'}
                                  </span>
                                )}
                                
                                {session.tag && (
                                  <div className="flex flex-wrap gap-1">
                                    {session.tag.split(',').map((tag, tagIndex) => (
                                      <span 
                                        key={tagIndex} 
                                        className={`${getTagColor(tag.trim())} px-2 py-0.5 text-xs rounded`}
                                      >
                                        {tag.trim()}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
      
      {/* Session detail modal - shown within this component */}
      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={handleCloseSessionModal} 
        />
      )}
    </>
  );
}