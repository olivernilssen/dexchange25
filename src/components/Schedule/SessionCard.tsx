import { formatTime } from '../../utils/timeUtils';
import { Session } from '../../types/schedule';
import FavoriteButton from './FavoriteButton';
import SessionTags from './SessionTags';
import SessionTypeBadge from './SessionTypeBadge';

interface SessionCardProps {
  session: Session & { room?: string };
  onClick: (session: Session & { room?: string }) => void;
  isCommon?: boolean;
  dayIndex: number;
  isCompleted?: boolean;
}

export default function SessionCard({ session, onClick, isCommon = false, dayIndex, isCompleted }: SessionCardProps) {
  // Determine if session is a workshop
  const isWorkshop = session.kind === 'workshop';
  
  // Base card styling
  const cardStyles = isWorkshop 
    ? 'border-l-4 border-[#e05252] bg-[#fff0f0]' // Stronger red theme for workshops
    : 'border-l-4 border-[#3949ab] bg-[#f0f4ff]'; // Stronger blue theme for speeches
  
  const iconSymbol = isWorkshop 
    ? '🔧' 
    : '🎤';
  
  return (
    <div 
      className={`relative p-3 rounded shadow ${cardStyles} cursor-pointer hover:shadow-md transition-all ${isCompleted ? 'bg-green-100' : ''}`}
      onClick={() => onClick(session)}
    >
      {/* Favorite star button in the top-right corner */}
      <FavoriteButton 
        session={session} 
        dayIndex={dayIndex} 
        className="absolute top-2 right-2" 
      />
      
      {/* Position indicator dot with type-specific color */}
      <div className={`absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full ${
        isWorkshop ? 'bg-[#e05252]' : 'bg-[#3949ab]'
      } border-2 border-white`}></div>
      
      {/* Add a distinctive pattern stripe for workshops */}
      {isWorkshop && (
        <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
          <div className="absolute transform rotate-45 bg-[#ffdddd] w-16 h-3 top-6 right-[-8px]"></div>
        </div>
      )}
      
      {/* Title with session type icon - add right padding for star */}
      <div className="font-bold text-[#333333] flex items-center pr-8">
        <span className="mr-2">{iconSymbol}</span>
        {session.title}
      </div>
      
      {/* Time slot */}
      <div className={isWorkshop ? "text-[#b73939]" : "text-[#3949ab]"}>
        {formatTime(session.start)} - {formatTime(session.end)}
      </div>
      
      {/* Speaker info */}
      {session.speaker && (
        <div className="text-[#333333] mt-1">{session.speaker}</div>
      )}
      
      {/* Tags section */}
      <div className="flex flex-wrap gap-1 mt-2">
        {/* Session type badge */}
        {session.kind && <SessionTypeBadge type={session.kind} />}
        
        {/* Content tags */}
        {session.tag && <SessionTags tags={session.tag} />}
      </div>
      
      {/* Duration indicator for workshops */}
      {isWorkshop && (
        <div className="mt-2 text-xs text-[#e05252] font-medium">
          Interaktiv økt • {calculateDuration(session.start, session.end)} min
        </div>
      )}
      
      {/* Completed indicator */}
      {isCompleted 
        && <span className="text-green-500 text-xs">(Completed)</span>
      }
    </div>
  );
}

// Helper function to calculate session duration in minutes
function calculateDuration(start: string, end: string): number {
  const startParts = start.split(':')[1].replace('.', ':').split(':').map(Number);
  const endParts = end.split(':')[1].replace('.', ':').split(':').map(Number);
  
  const startMinutes = startParts[0] * 60 + (startParts[1] || 0);
  const endMinutes = endParts[0] * 60 + (endParts[1] || 0);
  
  return endMinutes - startMinutes;
}