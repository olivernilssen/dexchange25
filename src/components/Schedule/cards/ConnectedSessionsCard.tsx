import React from 'react';
import { Session } from '../../../types/schedule';
import SessionTags from '../../ui/SessionTags';
import FavoriteButton from '../favorites/FavoriteButton';
import RoomDisplay from '../RoomDisplay';
import SessionCard from '../../ui/SessionCard';
import SessionTimeDisplay from '../../ui/SessionTimeDisplay';
import SessionTypeBadge from '../../ui/SessionTypeBadge';

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
  isCompleted = false,
  showRoom = true
}: ConnectedSessionsCardProps) {
  if (!sessions.length) return null;
  
  const firstSession = sessions[0];
  const type = isCommon ? 'common' : firstSession.kind === 'workshop' ? 'workshop' : 'speech';
  
  return (
    <SessionCard 
      type={type}
      className="h-full flex flex-col pl-4 sm:pl-3"
    >
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
          
          return (
            <div 
              key={index}
              className={`pt-3 ${isLastSession ? 'pb-4' : 'pb-3'} cursor-pointer ${
                type === 'workshop' ? 'hover:bg-workshop-hover' : 
                type === 'speech' ? 'hover:bg-speech-hover' : 
                'hover:bg-common-hover'
              } transition-colors`}
              onClick={() => onClick(session)}
            >
              {/* Time and room info */}
              <div className="flex items-center justify-between mb-1 pr-10">
                <SessionTimeDisplay
                  startTime={session.start}
                  endTime={session.end}
                  isCompleted={isCompleted}
                  type={type}
                />
                
                {showRoom && index === 0 && session.room && (
                  <RoomDisplay 
                    room={session.room}
                    isCommon={isCommon}
                    dayIndex={dayIndex}
                  />
                )}
              </div>
              
              {/* Session title with reduced font size on mobile */}
              <div className="font-bold text-neutral-text-primary pr-8 text-sm sm:text-base">
                {session.title}
              </div>
              
              {/* Speaker info */}
              {session.speaker && (
                <div className="text-neutral-text-secondary mt-1 text-xs sm:text-sm">
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
    </SessionCard>
  );
}