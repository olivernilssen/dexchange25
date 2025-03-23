import { useState, useEffect } from 'react';
import { getTimeFromString } from '../../utils/timeUtils';
import { Day, Session, ScheduleData } from '../../types/schedule';
import DayTabs from './DayTabs';
import CommonTimeline from './CommonTimeline';
import RoomTimelines from './RoomTimelines';
import SessionModal from './SessionModal';
import NextSessions from './NextSessions';
import FavoritesView from './FavoritesView';

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

  const renderActiveDay = () => {
    if (!scheduleData.schedule.days[activeDay]) {
      return null;
    }
    
    const currentDay = scheduleData.schedule.days[activeDay];
    
    // Get all breaks
    const allBreaks = currentDay.breaks || [];
    
    // Find earliest session start time and latest session end time across all rooms
    let earliestSessionStart = Number.MAX_SAFE_INTEGER;
    let latestSessionEnd = 0;
    
    // Process room sessions to find earliest start and latest end time
    if (currentDay.tracks) {
      currentDay.tracks.forEach(track => {
        if (track.sessions && track.sessions.length > 0) {
          track.sessions.forEach(session => {
            const startTime = getTimeFromString(session.start);
            const endTime = getTimeFromString(session.end);
            
            if (startTime < earliestSessionStart) {
              earliestSessionStart = startTime+1;
            }
            
            if (endTime > latestSessionEnd) {
              latestSessionEnd = endTime-1;
            }
          });
        }
      });
    }
    
    // console.log(`Time boundaries: earliest=${earliestSessionStart}, latest=${latestSessionEnd}`);
    
    // Split breaks based on session times
    const commonBreaks = allBreaks.filter(breakItem => {
      const breakStart = getTimeFromString(breakItem.start);
      const isBeforeFirstSession = breakStart < earliestSessionStart;
      const isAfterLastSession = breakStart >= latestSessionEnd;
      
      return isBeforeFirstSession || isAfterLastSession;
    });
    
    const roomBreaks = allBreaks.filter(breakItem => {
      const breakStart = getTimeFromString(breakItem.start);
      return breakStart >= earliestSessionStart && breakStart < latestSessionEnd;
    });
    
    // Get a user-friendly day name
    const dayName = activeDay === 0 ? "Dag 1" : activeDay === 1 ? "Dag 2" : `Dag ${activeDay + 1}`;
    
    return (
      <div className="border border-[#8991cd] rounded-lg p-4 bg-white shadow">
        <h2 className="text-xl font-bold text-[#081079] mb-4">
          {dayName}
        </h2>
        
        {/* Common Sessions with breaks before/after room sessions */}
        <CommonTimeline 
          day={currentDay} 
          commonBreaks={commonBreaks} 
          onSessionClick={handleSessionClick} 
        />
        
        {/* Integrated timeline with breaks during room sessions */}
        <RoomTimelines 
          day={currentDay} 
          roomBreaks={roomBreaks} 
          onSessionClick={handleSessionClick} 
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
      <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50">
        <h3 className="font-medium text-black mb-2">Debug Controls</h3>
        <div className="flex items-center text-black">
          <label className="mr-2">Test Time:</label>
          <input 
            type="text" 
            placeholder="e.g. 2025-04-09:14.30" 
            className="border border-black-300 px-2 py-1 rounded text-black"
            onChange={(e) => setTestCurrentTime(e.target.value)}
          />
          <button
            onClick={() => setTestCurrentTime(undefined)}
            className="ml-2 text-sm text-blue-500"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-black mt-1">
          Format: YYYY-MM-DD:HH.MM (e.g., 2025-04-09:14.30)
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#081079] mb-3">Event Schedule</h2>
      
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
        <FavoritesView scheduleData={scheduleData} />
      ) : (
        <>
          {/* Next Sessions Button & Modal */}
          <NextSessions
            day={scheduleData.schedule.days[activeDay]}
            dayIndex={activeDay}  // Pass the activeDay as dayIndex
            onSessionClick={handleSessionClick}
            currentTime={testCurrentTime}
          />
          
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
  );
}