import SessionCard from './SessionCard';

export default function TrackSection({ track, onSessionClick }) {
  if (!track.sessions || track.sessions.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h5 className="font-medium text-[#6c7cbc] bg-[#b4bce3] bg-opacity-20 p-2 rounded">
        {track.room}
      </h5>
      <div className="space-y-3 mt-3">
        {track.sessions.map((session, sessionIdx) => (
          <SessionCard 
            key={sessionIdx} 
            session={{...session, room: track.room}}
            onClick={() => onSessionClick({...session, room: track.room})}
          />
        ))}
      </div>
    </div>
  );
}