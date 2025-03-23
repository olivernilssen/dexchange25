import SessionCard from '../SessionCard';

export default function CommonSessions({ sessions, onSessionClick }) {
  if (!sessions || sessions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h4 className="font-medium text-[#081079] mb-2">Felles sesjoner</h4>
      <div className="space-y-3">
        {sessions.map((session, idx) => (
          <div key={idx}>
            <div className="bg-[#c98376] bg-opacity-10 p-2 rounded-md font-medium text-center text-[#081079] mb-2">
              Felles sesjoner
            </div>
            <SessionCard 
              session={session} 
              onClick={() => onSessionClick(session)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}