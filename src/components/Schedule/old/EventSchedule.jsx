import { useState } from 'react';
import DayTabs from '../DayTabs';
import BreaksList from './BreaksList';
import CommonSessions from './CommonSessions';
import TracksList from './TracksList';
import SessionModal from '../SessionModal';

export default function EventSchedule({ scheduleData }) {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  
  if (!scheduleData || !scheduleData.days || scheduleData.days.length === 0) {
    return <div className="text-red-500">Invalid schedule data format</div>;
  }
  
  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };
  
  const handleCloseModal = () => {
    setSelectedSession(null);
  };
  
  const currentDay = scheduleData.days[activeDay];
  
  return (
    <div className="container mx-auto">
      <DayTabs 
        days={scheduleData.days} 
        activeDay={activeDay} 
        setActiveDay={setActiveDay} 
      />
      
      <div className="mt-4">
        <h3 className="text-xl font-bold text-[#081079] mb-4">
          {new Date(currentDay.date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </h3>
        
        <BreaksList breaks={currentDay.breaks} />
        
        <CommonSessions 
          sessions={currentDay.commonSessions} 
          onSessionClick={handleSessionClick}
        />
        
        <TracksList 
          tracks={currentDay.tracks} 
          onSessionClick={handleSessionClick}
        />
      </div>
      
      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}