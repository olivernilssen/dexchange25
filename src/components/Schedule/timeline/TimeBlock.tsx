// Updated TimeBlock.tsx
import { Session } from '../../../types/schedule';
import SessionCard from '../cards/SessionCard';
import BreakCard from '../../ui/BreakCard';
import ConnectedSessionsCard from '../cards/ConnectedSessionsCard';
import { TimelineItem } from '../../../types/timeline';
import { getTimeFromString } from '../../../utils/timeUtils';
import { getRoomNameForSession } from '@/config/rooms';
import { ROOM_ORDER_BY_DAY } from '@/config/rooms';

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
    group.length > 0 && getTimeFromString(group[0].start) === block.time
  );
  
  // Safely filter individual items
  const filteredBlockItems = (block.items || []).filter(item => {
    if (!item) return false; // Skip undefined items
    if (item.isBreak) return true;
    if (item.isConnectedGroup) return false;
    
    const sessionKey = `${item.title}-${item.start}`;
    return !processedItems.has(sessionKey);
  });
  
  // Combine all items for this time block in the correct order
  const allBlockItems = [
    // Put all items together - breaks will be displayed differently but kept in the same timeblock
    ...filteredBlockItems,
    ...timeBlockConnectedGroups
  ];
  
  // Check if block has content
  const hasContent = allBlockItems.length > 0;
  if (!hasContent) return null;
  
  // Get room order for the current day
  const roomOrder = ROOM_ORDER_BY_DAY[dayIndex] || [];
  
  // Function to get room sort order
  const getRoomSortOrder = (item: any): number => {
    if (!item) return 999;
    
    // For break items - always first
    if (item.isBreak) return -1; 
    
    // For connected groups or regular sessions
    const room = Array.isArray(item) && item.length > 0 ? item[0].room : (item.room || '');
    
    // Handle common sessions - common sessions should go before regular sessions
    if (room === 'Felles' || ('isCommon' in item && item.isCommon)) {
      return 0; // Put common sessions at the top after breaks
    }
    
    const index = roomOrder.indexOf(room);
    return index === -1 ? 999 : index + 1; // Offset by 1 to keep common sessions first
  };
  
  // Sort items within their category by room order
  const sortedItems = [...allBlockItems].sort((a, b) => {
    // Breaks always go first
    if (a?.isBreak && !b?.isBreak) return -1;
    if (!a?.isBreak && b?.isBreak) return 1;
    
    // Then sort by room order
    return getRoomSortOrder(a) - getRoomSortOrder(b);
  });
  
  // Get break items and non-break items
  const breakItems = sortedItems.filter(item => item && item.isBreak);
  const sessionItems = sortedItems.filter(item => item && !item.isBreak);
  
  return (
    <div className="mb-6">
      <h3 className="text-xl font-medium text-primary-main border-b border-gray-200 pb-2 mb-3 sticky top-0 bg-white z-10">
        {block.displayTime}
      </h3>
      
      {/* Break items (always full-width) */}
      {breakItems.length > 0 && breakItems.map((item, idx) => (
        <div key={`break-${idx}`} className="my-2 w-full">
          <BreakCard breakItem={item} />
        </div>
      ))}
      
      {/* Session items in a grid */}
      {sessionItems.length > 0 && (
        <div className="grid gap-3 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Regular sessions and connected groups */}
          {sessionItems.map((item, itemIndex) => {
            // Connected session group
            if (Array.isArray(item) && item.length > 0) {
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
      )}
    </div>
  );
}