import React from 'react';
import { Session } from '../../types/schedule';
import { formatTime } from '../../utils/timeUtils';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';
import FavoriteButton from './FavoriteButton';
import { RoomBadge } from '../../utils/roomUtils';

interface ConnectedSessionsCardProps {
  sessions: Array<Session & { room?: string }>;
  onClick: (session: Session & { room?: string }) => void;
  isCommon?: boolean;
  dayIndex: number;
  isCompleted?: boolean;
  showRoom?: boolean;
}

export default function ConnectedSessionsCard({
  sessions,
  onClick,
  isCommon = false,
  dayIndex,
  isCompleted,
  showRoom = false
}: ConnectedSessionsCardProps) {
  // Define card styles based on session type
  const firstSession = sessions[0];
  const isWorkshop = firstSession.kind === 'workshop';
  
  const cardClasses = isCommon
    ? 'border-l-4 border-[#f0b429] bg-[#fffbf0]' // Common sessions
    : isWorkshop
      ? 'border-l-4 border-[#e05252] bg-[#fff5f5]' // Workshops
      : 'border-l-4 border-[#3949ab] bg-[#f5f7ff]'; // Talks
      
  // Define hover backgrounds for session items
  const hoverBg = isCommon
    ? 'hover:bg-[#fff7e0]' // Darker yellow for common
    : isWorkshop
      ? 'hover:bg-[#fff0f0]' // Darker red for workshop
      : 'hover:bg-[#f0f2fa]'; // Darker blue for talks
  
  return (
    <div className={`relative rounded shadow ${cardClasses} h-full flex flex-col pl-4 sm:pl-3`}>
      {/* Favorite star button in the top-right corner for the entire group */}
      <FavoriteButton 
        session={firstSession} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2 z-10" 
      />
      
      {/* Connected sessions */}
      <div className="divide-y divide-dashed divide-gray-300">
        {sessions.map((session, index) => {
          const isLastSession = index === sessions.length - 1;
          const timeTextColor = isCommon
            ? 'text-[#b88a00]'
            : session.kind === 'workshop'
              ? 'text-[#e05252]'
              : 'text-[#3949ab]';
          
          return (
            <div 
              key={index}
              className={`pt-3 ${isLastSession ? 'pb-4' : 'pb-3'} cursor-pointer ${hoverBg} transition-colors`}
              onClick={() => onClick(session)}
            >
              {/* Time and room info */}
              <div className="flex items-center justify-between mb-1 pr-10">
                <div className={`text-xs font-medium ${timeTextColor}`}>
                  {formatTime(session.start)} - {formatTime(session.end)}
                  {isCompleted && <span className="text-green-500 ml-2">(Completed)</span>}
                </div>
                
                {showRoom && index === 0 && session.room && (
                  isCommon
                    ? <RoomBadge room={dayIndex === 0 ? 'Arena' : 'Storsalen'} />
                    : <RoomBadge room={session.room} />
                )}
              </div>
              
              {/* Session title with reduced font size on mobile */}
              <div className="font-bold text-[#333333] pr-8 text-sm sm:text-base">
                {session.title}
              </div>
              
              {/* Speaker info */}
              {session.speaker && (
                <div className="text-[#333333] mt-1 text-xs sm:text-sm">
                  {session.speaker}
                </div>
              )}
              
              {/* Session tags */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {session.kind && <SessionTypeBadge type={session.kind} />}
                {session.tag && <SessionTags tags={session.tag} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}