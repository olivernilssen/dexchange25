import { useState } from 'react';
import SessionCard from './SessionCard';
import BreakIndicator from './BreakIndicator';
import SessionModal from './SessionModal';

export default function Timeline({ day }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  
  const handleSessionClick = (session, room) => {
    setSelectedSession(session);
    setSelectedRoom(room);
  };
  
  const closeModal = () => {
    setSelectedSession(null);
    setSelectedRoom(null);
  };
  
  // Get all time slots (including breaks)
  const allTimeSlots = [...(day.breaks || [])];
  
  // Add common sessions
  if (day.commonSessions) {
    day.commonSessions.forEach(session => {
      allTimeSlots.push(session);
    });
  }
  
  // Add track sessions
  if (day.tracks) {
    day.tracks.forEach(track => {
      if (track.sessions) {
        track.sessions.forEach(session => {
          allTimeSlots.push({ ...session, room: track.room });
        });
      }
    });
  }
  
  // Sort all events by start time
  allTimeSlots.sort((a, b) => a.start.localeCompare(b.start));
  
  return (
    <div className="mt-4">
      {/* Time slots */}
      {allTimeSlots.map((timeSlot, index) => {
        if (timeSlot.title && !timeSlot.speaker) {
          // This is a break
          return <BreakIndicator key={index} breakItem={timeSlot} />;
        } else if (day.commonSessions && day.commonSessions.includes(timeSlot)) {
          // This is a common session (plenary)
          return (
            <div key={index} className="col-span-full mb-4">
              <div className="bg-[#c98376] bg-opacity-10 p-2 rounded-md font-medium text-center text-[#081079] mb-2">
                Common Session - All Rooms
              </div>
              <SessionCard 
                session={timeSlot} 
                onClick={handleSessionClick} 
              />
            </div>
          );
        } else {
          // This is a regular session in a track
          return (
            <div key={index} className="mb-4">
              <div className="bg-[#8991cd] bg-opacity-10 p-2 rounded-md font-medium text-[#081079] mb-2">
                {timeSlot.room}
              </div>
              <SessionCard 
                session={timeSlot} 
                room={timeSlot.room}
                onClick={handleSessionClick} 
              />
            </div>
          );
        }
      })}
      
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          room={selectedRoom}
          onClose={closeModal}
        />
      )}
    </div>
  );
}