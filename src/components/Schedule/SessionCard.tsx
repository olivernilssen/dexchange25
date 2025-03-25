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
  // Determine card styling based on session type and whether it's common
  let cardStyles = '';
  let timeTextColor = '';
  
  if (isCommon) {
    // Common session styling (golden/yellow theme)
    cardStyles = 'border-l-4 border-[#f0b429] bg-[#fffbeb]';
    timeTextColor = 'text-[#b88a00]';
  } else if (session.kind === 'workshop') {
    // Workshop styling (red theme)
    cardStyles = 'border-l-4 border-[#e05252] bg-[#fff0f0]';
    timeTextColor = 'text-[#e05252]';
  } else {
    // Default/speech styling (blue theme)
    cardStyles = 'border-l-4 border-[#3949ab] bg-[#f0f4ff]';
    timeTextColor = 'text-[#3949ab]';
  }
  
  return (
    <div 
      className={`relative p-3 rounded shadow ${cardStyles} cursor-pointer hover:shadow-md transition-all ${isCompleted ? 'opacity-75' : ''}`}
      onClick={() => onClick(session)}
    >
      {/* Favorite star button in the top-right corner */}
      <FavoriteButton 
        session={session} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2" 
      />
      
      {/* Time and room display at the top of the card - Added pr-10 to prevent overlap */}
      <div className="flex items-center justify-between mb-2 pr-10">
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
      
      {/* Title with right padding for star */}
      <div className="font-bold text-[#333333] pr-8">
        {session.title}
      </div>
      
      {/* Speaker info */}
      {session.speaker && (
        <div className="text-[#333333] mt-1">{session.speaker}</div>
      )}
      
      {/* Tags and badges section */}
      <div className="flex flex-wrap items-center gap-1 mt-2">
        
        {/* Session type badge */}
        {session.kind && <SessionTypeBadge type={session.kind} />}
        
        {/* Content tags */}
        {session.tag && <SessionTags tags={session.tag} />}
      </div>
    </div>
  );
}