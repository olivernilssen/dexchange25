import { formatTime } from '../../utils/timeFormatters';

export default function SessionCard({ session, onClick }) {
  return (
    <div 
      onClick={() => onClick(session)}
      className="bg-white shadow rounded p-4 border-l-4 border-[#081079] cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex justify-between">
        <span className="text-sm text-[#6c7cbc]">
          {formatTime(session.start)} - {formatTime(session.end)}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          session.kind === 'workshop' 
            ? 'bg-[#edadac]' 
            : session.kind === 'speech'
              ? 'bg-[#8da9e4]'
              : 'bg-[#f6a495]'
        }`}>
          {session.kind || 'session'}
        </span>
      </div>
      <h3 className="font-bold mt-1">{session.title}</h3>
      {session.speaker && <p className="text-sm mt-1">{session.speaker}</p>}
      {session.tag && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {session.tag.split(',').map((tag, i) => (
            <span key={i} className="text-xs bg-[#b4bce3] px-2 py-0.5 rounded-full">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}