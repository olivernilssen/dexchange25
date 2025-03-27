import React from 'react';
import { Session } from '../../../types/schedule';
import { formatTime } from '../../../utils/timeUtils';
import SessionTags from '../../ui/SessionTags';
import SessionTypeBadge from '../../ui/SessionTypeBadge';
import FavoriteButton from '../favorites/FavoriteButton';
import RoomDisplay from '../RoomDisplay';
import { getRoomNameForSession } from '@/config/rooms';

interface SessionCardProps {
  session: Session;
  onClick: (session: Session & { room?: string }) => void;
  isCommon?: boolean;
  dayIndex: number;
  isCompleted?: boolean;
  showRoom?: boolean;
}

export default function SessionCard({ 
  session, 
  onClick, 
  isCommon = false, 
  dayIndex,
  isCompleted = false,
  showRoom = true
}: SessionCardProps) {
  const type = isCommon ? 'common' : session.kind === 'workshop' ? 'workshop' : 'speech';
  
  // Define card classes based on type
  const cardClasses = {
    workshop: "border-l-4 border-workshop-main bg-workshop-light hover:bg-workshop-hover",
    speech: "border-l-4 border-speech-main bg-speech-light hover:bg-speech-hover",
    common: "border-l-4 border-common-main bg-common-light hover:bg-common-hover"
  };
  
  // Define text color based on type
  const timeTextColor = {
    workshop: "text-workshop-text",
    speech: "text-speech-text",
    common: "text-common-text"
  };

  return (
    <div 
      className={`relative rounded shadow cursor-pointer transition-colors ${cardClasses[type]} h-full flex flex-col pl-4 sm:pl-3 ${isCompleted ? "opacity-75" : ""}`}
      onClick={() => onClick(session)}
    >
      <FavoriteButton 
        session={session} 
        dayIndex={dayIndex}
        className="absolute top-2 right-2 z-10" 
      />
      
      <div className="flex items-center justify-between mb-2 pr-10 pt-3">
        <div className={`text-xs font-medium ${timeTextColor[type]}`}>
          {formatTime(session.start)} - {formatTime(session.end)}
          {isCompleted && <span className="text-green-500 ml-2">(Completed)</span>}
        </div>
        
        {showRoom && session.room && (
          <RoomDisplay 
            room={getRoomNameForSession(dayIndex, session.room)}
            isCommon={isCommon}
            dayIndex={dayIndex}
          />
        )}
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium text-neutral-text-primary mb-1 pr-8">
          {session.title}
        </h3>
        
        {session.speaker && (
          <p className="text-sm text-neutral-text-secondary mb-2">
            {session.speaker}
          </p>
        )}
        
        {/* Add tags here if needed */}
        {session.kind && (
          <div className="flex flex-wrap gap-1 mt-2">
            <SessionTypeBadge type={session.kind} />
            {session.tag && <SessionTags tags={session.tag} />}
          </div>
        )}
      </div>
    </div>
  );
}