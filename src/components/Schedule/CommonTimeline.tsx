import { getTimeFromString } from '../../utils/timeUtils';
import { Day, Session } from '../../types/schedule';
import SessionCard from './SessionCard';
import BreakCard from './BreakCard';

interface CommonTimelineProps {
  day: Day;
  commonBreaks: any[];
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
}

export default function CommonTimeline({ day, commonBreaks, onSessionClick, isSessionCompleted }: CommonTimelineProps) {
  const hasCommonSessions = day.commonSessions && day.commonSessions.length > 0;
  const hasCommonBreaks = commonBreaks && commonBreaks.length > 0;
  
  if (!hasCommonSessions && !hasCommonBreaks) return null;
  
  // Create a merged timeline
  const timelineItems = [
    // Convert common sessions to timeline items
    ...(day.commonSessions || []).map(session => ({
      ...session,
      isBreak: false,
      startTime: getTimeFromString(session.start),
      room: "Felles"
    })),
    
    // Convert breaks to timeline items
    ...commonBreaks.map(breakItem => ({
      ...breakItem,
      isBreak: true,
      startTime: getTimeFromString(breakItem.start)
    }))
  ];
  
  // Sort all items by start time
  timelineItems.sort((a, b) => a.startTime - b.startTime);
  
  return (
    <div className="mb-6">
      <h3 className="font-medium text-[#081079] mb-3">Felles sesjoner i </h3>
      
      <div className="relative">
        {/* Create a timeline line */}
        {/* <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#8991cd] opacity-20"></div> */}
        
        <div className="space-y-3 pl-1 pt-2 pb-2">
          {timelineItems.map((item, index) => (
            item.isBreak ? (
              <BreakCard 
                key={`common-break-${index}`}
                breakItem={item}
              />
            ) : (
              <div key={`common-session-${index}`} className="session-item">
                <SessionCard 
                  session={item}
                  onClick={onSessionClick}
                  isCommon={true} 
                  dayIndex={0}              
                />
                {isSessionCompleted(item) && (
                  <span className="text-green-500 ml-2">(Completed)</span>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}