import { Day, Session } from '../../types/schedule';
import TimeBlock from './TimeBlock';
import {
  Break,
  TimelineItem,
  collectTimelineItems,
  findConnectedSessions,
  createTimeBlocks
} from '../../utils/sessionProcessing';

interface ChronologicalTimelineProps {
  day: Day;
  breaks: Break[];
  dayIndex: number;
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
}

export default function ChronologicalTimeline({ 
  day, 
  breaks, 
  dayIndex,
  onSessionClick, 
  isSessionCompleted 
}: ChronologicalTimelineProps) {
  console.log("ChronologicalTimeline received props:", { 
    dayTracks: day?.tracks?.length, 
    commonSessions: day?.commonSessions?.length,
    breaks: breaks?.length,
    dayIndex 
  });
  
  // Collect all items
  const allItems = collectTimelineItems(day, breaks);
  
  // Find connected sessions
  const { connectedGroups, processedItems } = findConnectedSessions(allItems);
  
  // Create time blocks
  const timeBlocks = createTimeBlocks(allItems, connectedGroups, processedItems);
  
  // Fallback if no time blocks
  if (timeBlocks.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded border">
        <h3 className="text-lg font-medium">No schedule items found</h3>
        <p>There are no sessions or breaks scheduled for this day.</p>
      </div>
    );
  }
  
  // Render time blocks
  return (
    <div className="space-y-4">
      {timeBlocks.map((block, blockIndex) => (
        <TimeBlock
          key={blockIndex}
          block={block}
          blockIndex={blockIndex}
          connectedGroups={connectedGroups}
          processedItems={processedItems}
          dayIndex={dayIndex}
          onSessionClick={onSessionClick}
          isSessionCompleted={isSessionCompleted}
        />
      ))}
    </div>
  );
}