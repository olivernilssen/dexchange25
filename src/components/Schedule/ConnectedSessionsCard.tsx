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
  if (!sessions.length) return null;
  
  const firstSession = sessions[0];
  const lastSession = sessions[sessions.length - 1];
  
  // Determine card styling based on session type and whether it's common
  let cardStyles = '';
  
  if (isCommon) {
    // Common session styling (golden/yellow theme)
    cardStyles = 'border-l-4 border-[#f0b429] bg-[#fffbeb]';
  } else if (firstSession.kind === 'workshop') {
    // Workshop styling (red theme)
    cardStyles = 'border-l-4 border-[#e05252] bg-[#fff0f0]';
  } else {
    // Default/speech styling (blue theme)
    cardStyles = 'border-l-4 border-[#3949ab] bg-[#f0f4ff]';
  }
  
  return (
    <div className={`relative p-3 rounded shadow ${cardStyles} ${isCompleted ? 'opacity-75' : ''}`}>
      {/* Master favorite button for the entire group */}
      <FavoriteButton 
        session={firstSession} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2"
        isInConnectedGroup={true}
        connectedSessions={sessions}
      />
      
      {/* Room and time display for the whole group */}
      <div className="flex items-center justify-between mb-2 pr-10">
        <div className="text-xs font-medium text-gray-500">
          {formatTime(firstSession.start)} - {formatTime(lastSession.end)}
        </div>
        
        {showRoom && firstSession.room && (
          isCommon
            ? <RoomBadge room={dayIndex === 0 ? 'Arena' : 'Storsalen'} />
            : <RoomBadge room={firstSession.room} />
        )}
      </div>
      
      {/* Sessions */}
      <div className="divide-y divide-dashed">
        {sessions.map((session, index) => (
          <div 
            key={`${session.title}-${session.start}`}
            className={`py-2 ${index === 0 ? 'pt-0' : ''} ${index === sessions.length - 1 ? 'pb-0' : ''} cursor-pointer`}
            onClick={() => onClick(session)}
          >
            {/* Time moved to top */}
            <div className="text-xs font-medium">
              <span className={
                isCommon ? "text-[#b88a00]" : 
                session.kind === 'workshop' ? "text-[#e05252]" : 
                "text-[#3949ab]"
              }>
                {formatTime(session.start)} - {formatTime(session.end)}
              </span>
            </div>
            
            {/* Title */}
            <div className="mt-1">
              <h3 className="font-bold text-[#333333]">{session.title}</h3>
            </div>
            
            {/* Speaker */}
            {session.speaker && (
              <div className="text-[#333333] mt-1">{session.speaker}</div>
            )}
            
            {/* Tags section */}
            <div className="flex flex-wrap items-center gap-1 mt-2">
              
              {/* Session type badge */}
              {session.kind && <SessionTypeBadge type={session.kind} />}
              
              {/* Content tags */}
              {session.tag && <SessionTags tags={session.tag} />}
            </div>
          </div>
        ))}
      </div>
      
      {/* Removed the duplicate footer with time range */}
    </div>
  );
}