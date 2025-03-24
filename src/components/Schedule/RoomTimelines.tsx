import { getTimeFromString } from '../../utils/timeUtils';
import { Day, Session } from '../../types/schedule';
import SessionCard from './SessionCard';
import BreakCard from './BreakCard';

interface RoomTimelinesProps {
  day: Day;
  roomBreaks: any[];
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
}

export default function RoomTimelines({ day, roomBreaks, onSessionClick, isSessionCompleted }: RoomTimelinesProps) {
  if (!day.tracks || day.tracks.length === 0) {
    return null;
  }
  
  // Use only the remaining breaks (not those shown in common section)
  const breaks = roomBreaks || [];
  
  return (
    <div>
      <h3 className="font-medium text-[#081079] mb-4">Sesjoner på rom:</h3>
      
      {day.tracks.map((track, trackIndex) => (
        <div key={trackIndex} className="mb-8">
          <h4 className="bg-[#b4bce3] text-[#081079] p-2 rounded font-medium">
            {track.room}
          </h4>
          
          {track.sessions && track.sessions.length > 0 ? (
            <div className="mt-2 relative">
              {/* Create a timeline line */}
              {/* <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#8991cd] opacity-20"></div> */}
              
              <RoomTimelineItems
                sessions={track.sessions}
                breaks={breaks}
                room={track.room}
                onSessionClick={onSessionClick}
                isSessionCompleted={isSessionCompleted}
              />
            </div>
          ) : (
            <p className="text-[#081079] italic mt-2">Ingen sesjoner i dette rommet</p>
          )}
        </div>
      ))}
    </div>
  );
}

interface RoomTimelineItemsProps {
  sessions: Session[];
  breaks: any[];
  room: string;
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
}

function RoomTimelineItems({ sessions, breaks, room, onSessionClick, isSessionCompleted }: RoomTimelineItemsProps) {
  // Create a combined array of sessions and breaks
  const allItems = [
    // Convert sessions to timeline items
    ...sessions.map(session => ({
      ...session,
      isBreak: false,
      startTime: getTimeFromString(session.start),
      room: room
    })),
    
    // Convert breaks to timeline items
    ...breaks.map(breakItem => ({
      ...breakItem,
      isBreak: true,
      startTime: getTimeFromString(breakItem.start)
    }))
  ];
  
  // Sort all items by start time
  allItems.sort((a, b) => a.startTime - b.startTime);
  
  return (
    <div className="space-y-3 pl-1 pt-2 pb-2">
      {allItems.map((item, index) => (
        item.isBreak ? (
          <BreakCard 
            key={`break-${index}`}
            breakItem={item}
          />
        ) : (
          <SessionCard 
              key={`session-${index}`}
              session={item}
              onClick={onSessionClick} 
              dayIndex={0}          
              isCompleted={isSessionCompleted(item)}
          />
        )
      ))}
    </div>
  );
}