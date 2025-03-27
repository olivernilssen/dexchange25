import { formatTime } from '../../utils/timeUtils';
import { Session } from '../../types/schedule';
import FavoriteButton from './FavoriteButton';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';
import { getSessionCardStyles } from '../../styles/styleUtils';
import RoomBadge from './RoomBadge';

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
  const isWorkshop = session.kind === 'workshop';
  const styles = getSessionCardStyles(isCommon, isWorkshop);
  
  return (
    <div 
      className={`${styles.card} ${styles.hover} h-full flex flex-col pl-4 sm:pl-3 ${isCompleted ? 'opacity-75' : ''}`}
      onClick={() => onClick(session)}
    >
      {/* Favorite button */}
      <FavoriteButton 
        session={session} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2 z-10" 
      />
      
      {/* Time and room display at the top of the card */}
      <div className="flex items-center justify-between mb-2 pr-10 pt-3">
        <div className={`text-xs font-medium ${styles.timeText}`}>
          {formatTime(session.start)} - {formatTime(session.end)}
          {isCompleted && <span className="text-status-success ml-2">(Completed)</span>}
        </div>
        
        {showRoom && session.room && (
          <RoomBadge 
            room={session.room}
            isCommon={isCommon}
            dayIndex={dayIndex}
          />
        )}
      </div>
      
      {/* Title with right padding for star and responsive font size */}
      <div className="font-bold text-neutral-text-primary pr-8 text-sm sm:text-base">
        {session.title}
      </div>
      
      {/* Speaker info */}
      {session.speaker && (
        <div className="text-neutral-text-primary mt-1 text-xs sm:text-sm">
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