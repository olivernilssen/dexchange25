import { ScheduleData } from '../../types/schedule';
import DayTabs from './DayTabs';
import SessionModal from './SessionModal';
import FavoritesView from './favorites/FavoritesView';
import ScrollManager from '../ScrollManager';
import DaySchedule from './DaySchedule';
import DebugControls from './DebugControls';
import { useScheduleState } from '../../hooks/useScheduleState';

interface ScheduleViewProps {
  scheduleData: ScheduleData;
}

export default function ScheduleView({ scheduleData }: ScheduleViewProps) {
  // Use custom hook to manage state
  const {
    activeDay,
    showFavorites,
    selectedSession,
    testCurrentTime,
    handleDayChange,
    handleFavoritesToggle,
    handleSessionClick,
    closeModal,
    isSessionCompleted,
    setTestCurrentTime
  } = useScheduleState(scheduleData);

  return (
    <>
      {/* This handles scroll position persistence */}
      <ScrollManager />
      
      <div className="pb-16">
        <h2 className="text-2xl font-bold text-primary-main mb-3">Event Schedule</h2>
        
        {/* Combined day and favorites tabs */}
        <DayTabs 
          days={scheduleData.schedule.days} 
          activeDay={activeDay} 
          showFavorites={showFavorites}
          onDayChange={handleDayChange}
          onFavoritesToggle={handleFavoritesToggle}
        />
        
        {/* Main content - either day schedule or favorites */}
        {showFavorites ? (
          <FavoritesView 
            scheduleData={scheduleData} 
            isSessionCompleted={isSessionCompleted} 
          />
        ) : (
          <DaySchedule
            day={scheduleData.schedule.days[activeDay]}
            dayIndex={activeDay}
            onSessionClick={handleSessionClick}
            isSessionCompleted={isSessionCompleted}
            testCurrentTime={testCurrentTime}
          />
        )}
        
        {/* Session Modal */}
        <SessionModal 
          session={selectedSession} 
          onClose={closeModal} 
        />

        {/* Debug Controls - properly connected */}
        <DebugControls setTestCurrentTime={setTestCurrentTime} />
      </div>
    </>
  );
}