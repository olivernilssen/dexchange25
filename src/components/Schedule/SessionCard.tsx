import { formatTime } from '../../utils/timeUtils';
import { Session } from '../../types/schedule';
import FavoriteButton from './FavoriteButton';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';
import { RoomBadge } from '../../utils/roomUtils';

interface SessionCardProps {
  session: Session & { room?: string };
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
  isCompleted,
  showRoom = false
}: SessionCardProps) {
  // Define base colors (without hover)
  const baseClasses = isCommon
    ? 'border-l-4 border-[#f0b429] bg-[#fffbf0]'
    : session.kind === 'workshop'
      ? 'border-l-4 border-[#e05252] bg-[#fff5f5]'
      : 'border-l-4 border-[#3949ab] bg-[#f5f7ff]';
  
  // Define hover colors separately
  const hoverClasses = isCommon
    ? 'hover:bg-[#fff7e0]' // Darker yellow for common
    : session.kind === 'workshop'
      ? 'hover:bg-[#fff0f0]' // Darker red for workshop
      : 'hover:bg-[#f0f2fa]'; // Darker blue for talks
  
  // Time text color based on session type
  const timeTextColor = isCommon
    ? 'text-[#b88a00]'
    : session.kind === 'workshop'
      ? 'text-[#e05252]'
      : 'text-[#3949ab]';
  
  return (
    <div 
      className={`
        relative rounded shadow cursor-pointer transition-colors
        ${baseClasses} ${hoverClasses}
        ${isCompleted ? 'opacity-75' : ''} 
        h-full flex flex-col pl-4 sm:pl-3
      `}
      onClick={() => onClick(session)}
    >
      {/* Favorite star button in the top-right corner */}
      <FavoriteButton 
        session={session} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2" 
      />
      
      {/* Time and room display at the top of the card */}
      <div className="flex items-center justify-between mb-2 pr-10 pt-3">
        <div className={`text-xs font-medium ${timeTextColor}`}>
          {formatTime(session.start)} - {formatTime(session.end)}
          {isCompleted && <span className="text-green-500 ml-2">(Completed)</span>}
        </div>
        
        {showRoom && session.room && (
          isCommon
            ? <RoomBadge room={dayIndex === 0 ? 'Arena' : 'Storsalen'} />
            : <RoomBadge room={session.room} />
        )}
      </div>
      
      {/* Title with right padding for star and responsive font size */}
      <div className="font-bold text-[#333333] pr-8 text-sm sm:text-base">
        {session.title}
      </div>
      
      {/* Speaker info */}
      {session.speaker && (
        <div className="text-[#333333] mt-1 text-xs sm:text-sm">
          {session.speaker}
        </div>
      )}
      
      {/* Tags and badges section - more bottom padding */}
      <div className="flex flex-wrap items-center gap-1 mt-auto pt-2 pb-3">
        {session.kind && <SessionTypeBadge type={session.kind} />}
        {session.tag && <SessionTags tags={session.tag} />}
      </div>
    </div>
  );
}