import { Day, Session } from '../../types/schedule';
import ChronologicalTimeline from './timeline/ChronologicalTimeline';
import NextSessions from './timeline/NextSessions';

interface DayScheduleProps {
  day: Day;
  dayIndex: number;
  onSessionClick: (session: Session & { room?: string }) => void;
  isSessionCompleted: (session: Session) => boolean;
  testCurrentTime?: string;
}

export default function DaySchedule({
  day,
  dayIndex,
  onSessionClick,
  isSessionCompleted,
  testCurrentTime
}: DayScheduleProps) {
  // Get a user-friendly day name
  const dayName = dayIndex === 0 ? "Dag 1" : dayIndex === 1 ? "Dag 2" : `Dag ${dayIndex + 1}`;
  
  // Get all breaks (ensuring it's an array)
  const allBreaks = day.breaks || [];
  
  return (
    <>
      {/* Next Sessions Button & Modal */}
      <div className="mb-4">
        <NextSessions
          day={day}
          dayIndex={dayIndex}
          onSessionClick={onSessionClick}
          currentTime={testCurrentTime}
        />
      </div>
      
      {/* Active day content */}
      <div className="border border-primary-light rounded-lg p-4 bg-neutral-card shadow">
        <h2 className="text-xl font-bold text-primary-main mb-4">
          {dayName}
        </h2>
        
        {/* Use the ChronologicalTimeline component */}
        <ChronologicalTimeline 
          day={day} 
          breaks={allBreaks} 
          dayIndex={dayIndex}
          onSessionClick={onSessionClick} 
          isSessionCompleted={isSessionCompleted}
        />
      </div>
    </>
  );
}