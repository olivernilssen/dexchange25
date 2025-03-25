import React from 'react';
import { Session } from '../../types/schedule';
import { formatTime } from '../../utils/timeUtils';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';
import FavoriteButton from './FavoriteButton';
import { RoomBadge } from '../../utils/roomUtils';
import { getSessionCardStyles } from '../../styles/styleUtils';
import { SESSION_COLORS } from '../../styles/theme';
import RoomDisplay from './RoomDisplay';

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
  const isWorkshop = firstSession.kind === 'workshop';
  const styles = getSessionCardStyles(isCommon, isWorkshop);
  
  return (
    <div className={`${styles.card} h-full flex flex-col pl-4 sm:pl-3`}>
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
          
          // Get the time text color directly
          const timeTextColor = isCommon
            ? SESSION_COLORS.common.textColor
            : session.kind === 'workshop'
              ? SESSION_COLORS.workshop.textColor
              : SESSION_COLORS.talk.textColor;
          
          // Or simplify by using the styles from the first session
          // const timeTextColor = styles.timeText;
          
          return (
            <div 
              key={index}
              className={`pt-3 ${isLastSession ? 'pb-4' : 'pb-3'} cursor-pointer ${styles.hover} transition-colors`}
              onClick={() => onClick(session)}
            >
              {/* Time and room info */}
              <div className="flex items-center justify-between mb-1 pr-10">
                <div className={`text-xs font-medium ${timeTextColor}`}>
                  {formatTime(session.start)} - {formatTime(session.end)}
                  {isCompleted && <span className="text-green-500 ml-2">(Completed)</span>}
                </div>
                
                {showRoom && index === 0 && session.room && (
                    <RoomDisplay 
                        room={session.room}
                        isCommon={isCommon}
                        dayIndex={dayIndex}
                    />
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