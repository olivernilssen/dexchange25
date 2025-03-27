import { Session } from '../../types/schedule';
import SessionCard from './SessionCard';
import BreakCard from './BreakCard';
import ConnectedSessionsCard from './ConnectedSessionsCard';
import { getTimeFromString } from '../../utils/timeUtils';
import { TimelineItem } from '../../types/schedule';

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

// Define consistent room order for different days
const ROOM_ORDER_BY_DAY: Record<number, string[]> = {
  0: ['Arena', 'Klasserom', 'Kantina', 'Landegode'], // Day 1
  1: ['Storsalen', 'Storsal 1', 'Storsal 2', 'Storsal 3', 'The Social', 'Saltstraumen', 'Salten']  // Day 2
};

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
  
  // Combine all items for this time block
  const allBlockItems = [
    // Handle breaks specially - they span the entire row
    ...filteredBlockItems.filter(item => item.isBreak),
    // Connected sessions
    ...timeBlockConnectedGroups,
    // Regular sessions
    ...filteredBlockItems.filter(item => !item.isBreak)
  ];
  
  // Check if block has content
  const hasContent = allBlockItems.length > 0;
  if (!hasContent) return null;
  
  // Sort sessions by room according to the predefined order
  const roomOrder = ROOM_ORDER_BY_DAY[dayIndex] || [];
  
  // Function to get room sort order
  const getRoomSortOrder = (item: any): number => {
    // For break items
    if (item.isBreak) return -1; // Always show breaks first
    
    // For connected groups or regular sessions
    const room = Array.isArray(item) ? item[0].room : item.room;
    
    // Handle common sessions
    if (room === 'Felles') {
      return roomOrder.indexOf(dayIndex === 0 ? 'Arena' : 'Storsalen');
    }
    
    const index = roomOrder.indexOf(room);
    return index === -1 ? 999 : index; // If not found, put at the end
  };
  
  // Sort non-break items by room
  const sortedItems = [...allBlockItems].sort((a, b) => {
    // Breaks always go first
    if (a.isBreak) return -1;
    if (b.isBreak) return 1;
    
    // Sort by room order
    return getRoomSortOrder(a) - getRoomSortOrder(b);
  });
  
  return (
    <div className="time-block mb-6">
      <h3 className="text-lg font-medium text-primary-main sticky top-0 bg-white py-1 z-10 border-b">
        {block.displayTime}
      </h3>
      
      {/* Break items (always full-width) */}
      {sortedItems.filter(item => item.isBreak).map((item, idx) => (
        <div key={`break-${idx}`} className="my-2 w-full">
          <BreakCard breakItem={item} />
        </div>
      ))}
      
      {/* Session items */}
      <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Regular sessions and connected groups, now sorted consistently by room */}
        {sortedItems.filter(item => !item.isBreak).map((item, itemIndex) => {
          // Connected session group
          if (Array.isArray(item)) {
            const firstSession = item[0] as TimelineItem & { isBreak: false };
            const isCommon = 'isCommon' in firstSession ? !!firstSession.isCommon : false;
            
            return (
              <div key={`connected-group-${blockIndex}-${itemIndex}`} className="h-full">
                <ConnectedSessionsCard 
                  sessions={item}
                  onClick={onSessionClick}
                  isCommon={isCommon}
                  dayIndex={dayIndex}
                  isCompleted={isSessionCompleted(firstSession)}
                  showRoom={true}
                />
              </div>
            );
          }
          
          // Individual non-break session
          const isCommon = !item.isBreak && 'isCommon' in item ? !!item.isCommon : false;
          
          return (
            <div key={`single-item-${blockIndex}-${itemIndex}`} className="h-full">
              <SessionCard 
                session={item}
                onClick={onSessionClick}
                isCommon={isCommon}
                dayIndex={dayIndex}
                isCompleted={isSessionCompleted(item)}
                showRoom={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}