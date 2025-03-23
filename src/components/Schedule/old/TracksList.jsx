import TrackSection from './TrackSection';

export default function TracksList({ tracks, onSessionClick }) {
  if (!tracks || tracks.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h4 className="font-medium text-[#081079] mb-2">Sessions by Room</h4>
      <div className="space-y-6">
        {tracks.map((track, trackIdx) => (
          <TrackSection 
            key={trackIdx} 
            track={track} 
            onSessionClick={onSessionClick} 
          />
        ))}
      </div>
    </div>
  );
}