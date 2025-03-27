import { useState, useEffect } from 'react';
import { getTimeFromString } from '../../utils/timeUtils';
import { Day, Session, ScheduleData } from '../../types/schedule';
import DayTabs from './DayTabs';
import ChronologicalTimeline from './ChronologicalTimeline';
import SessionModal from './SessionModal';
import NextSessions from './NextSessions';
import FavoritesView from './FavoritesView';
import ScrollManager from '../ScrollManager';

interface ScheduleViewProps {
  scheduleData: ScheduleData;
}

export default function ScheduleView({ scheduleData }: ScheduleViewProps) {
  // Load saved tab state from localStorage
  const [activeDay, setActiveDay] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedDay = localStorage.getItem('activeDay');
      return savedDay ? parseInt(savedDay) : 0;
    }
    return 0;
  });
  
  const [showFavorites, setShowFavorites] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedShowFavorites = localStorage.getItem('showFavorites');
      return savedShowFavorites === 'true';
    }
    return false;
  });
  
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);
  const [testCurrentTime, setTestCurrentTime] = useState<string | undefined>(undefined);

  // Save tab state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeDay', activeDay.toString());
    localStorage.setItem('showFavorites', showFavorites.toString());
  }, [activeDay, showFavorites]);

  const handleDayChange = (index: number) => {
    setActiveDay(index);
  };

  const handleFavoritesToggle = () => {
    setShowFavorites(!showFavorites);
  };

  const handleSessionClick = (session: Session & { room?: string }) => {
    setSelectedSession(session);
  };

  const closeModal = () => {
    setSelectedSession(null);
  };

  const isSessionCompleted = (session: Session, currentTime: string | undefined): boolean => {
    const now = currentTime
      ? new Date(`${currentTime}`) // Append seconds to ensure proper parsing
      : new Date();

    if (isNaN(now.getTime())) {
      console.error("Invalid debug time format. Expected format: YYYY-MM-DDTHH:MM");
      return false;
    }

    const currentDay = scheduleData.schedule.days[activeDay];
    const sessionEndTime = new Date(`${currentDay.date}T${session.end}`);
    return now > sessionEndTime;
  };

  const renderActiveDay = () => {
    if (!scheduleData.schedule.days[activeDay]) {
      return null;
    }
    
    const currentDay = scheduleData.schedule.days[activeDay];
    
    // Get all breaks
    const allBreaks = currentDay.breaks || [];
    
    // Get a user-friendly day name
    const dayName = activeDay === 0 ? "Dag 1" : activeDay === 1 ? "Dag 2" : `Dag ${activeDay + 1}`;
    
    return (
      <div className="border border-speech-light rounded-lg p-4 bg-neutral-card shadow">
        <h2 className="text-xl font-bold text-primary-main mb-4">
          {dayName}
        </h2>
        
        {/* Use the new ChronologicalTimeline component */}
        <ChronologicalTimeline 
          day={currentDay} 
          breaks={allBreaks} 
          dayIndex={activeDay}  // Make sure this is being passed
          onSessionClick={handleSessionClick} 
          isSessionCompleted={(session) => isSessionCompleted(session, testCurrentTime)}
        />
      </div>
    );
  };

  // Add this to your ScheduleView component, somewhere near the bottom
  // This is for testing the feature with different times
  function renderDebugControls() {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="mt-8 p-4 border border-neutral-border rounded bg-neutral-background">
        <h3 className="font-medium text-neutral-text-primary mb-2">Debug Controls</h3>
        <div className="flex items-center text-neutral-text-primary">
          <label className="mr-2">Test Time:</label>
          <input 
            type="text" 
            placeholder="e.g. 2025-04-09T14:30" 
            className="border border-neutral-border px-2 py-1 rounded text-neutral-text-primary"
            onChange={(e) => setTestCurrentTime(e.target.value)}
          />
          <button
            onClick={() => setTestCurrentTime(undefined)}
            className="ml-2 text-sm text-status-info"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-neutral-text-secondary mt-1">
          Format: YYYY-MM-DDTHH:MM (e.g., 2025-04-09T14:30)
        </p>
      </div>
    );
  }

  return (
    <>
      {/* This handles scroll position persistence */}
      <ScrollManager />
      
      {/* Rest of your component */}
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
            isSessionCompleted={(session) => isSessionCompleted(session, testCurrentTime)} 
          />
        ) : (
          <>
            {/* Next Sessions Button & Modal */}
            <div className="mb-4">
              <NextSessions
                day={scheduleData.schedule.days[activeDay]}
                dayIndex={activeDay}
                onSessionClick={handleSessionClick}
                currentTime={testCurrentTime}
              />
            </div>
            
            {/* Active day content */}
            {renderActiveDay()}
          </>
        )}
        
        {/* Session Modal */}
        <SessionModal 
          session={selectedSession} 
          onClose={closeModal} 
        />

        {/* Debug Controls */}
        {renderDebugControls()}
      </div>
    </>
  );
}