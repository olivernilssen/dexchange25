import { Session } from '../../types/schedule';
import SessionCard from './SessionCard';
import BreakCard from './BreakCard';
import ConnectedSessionsCard from './ConnectedSessionsCard';
import { TimelineItem } from '../../utils/sessionProcessing';
import { getTimeFromString } from '../../utils/timeUtils';

interface TimeBlockProps {
  block: {
    time: number;
    displayTime: string;
    items: any[];
  };
  blockIndex: number;
  connectedGroups: TimelineItem[][];
  processedItems: Set<string>;
  dayIndex: number;
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
}

export default function TimeBlock({
  block,
  blockIndex,
  connectedGroups,
  processedItems,
  dayIndex,
  onSessionClick,
  isSessionCompleted
}: TimeBlockProps) {
  // Filter connected groups that belong to this time block
  const timeBlockConnectedGroups = connectedGroups.filter(group => 
    getTimeFromString(group[0].start) === block.time
  );
  
  // Filter individual items
  const filteredBlockItems = block.items.filter(item => {
    if (item.isBreak) return true;
    if (item.isConnectedGroup) return false;
    
    const sessionKey = `${item.title}-${item.start}`;
    return !processedItems.has(sessionKey);
  });
  
  // Check if block has content
  const hasContent = timeBlockConnectedGroups.length > 0 || filteredBlockItems.length > 0;
  if (!hasContent) return null;
  
  return (
    <div className="time-block">
      <h3 className="text-lg font-medium text-[#081079] sticky top-0 bg-white py-1 z-10">
        {block.displayTime}
      </h3>
      
      <div className="space-y-3 mt-2">
        {/* Connected session groups */}
        {timeBlockConnectedGroups.map((group, groupIndex) => {
          // Type assertion to ensure TypeScript knows this is a non-break session
          const firstSession = group[0] as TimelineItem & { isBreak: false };
          const isCommon = 'isCommon' in firstSession ? !!firstSession.isCommon : false;
          
          return (
            <div key={`connected-group-${blockIndex}-${groupIndex}`}>
              <ConnectedSessionsCard 
                sessions={group}
                onClick={onSessionClick}
                isCommon={isCommon}
                dayIndex={dayIndex}
                isCompleted={isSessionCompleted(firstSession)}
                showRoom={true}
              />
            </div>
          );
        })}
        
        {/* Individual items */}
        {filteredBlockItems.map((item, itemIndex) => {
          const isCommon = !item.isBreak && 'isCommon' in item ? !!item.isCommon : false;
          
          return (
            <div key={`single-item-${blockIndex}-${itemIndex}`}>
              {item.isBreak ? (
                <BreakCard breakItem={item} />
              ) : (
                <SessionCard 
                  session={item}
                  onClick={onSessionClick}
                  isCommon={isCommon}
                  dayIndex={dayIndex}
                  isCompleted={isSessionCompleted(item)}
                  showRoom={true}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}