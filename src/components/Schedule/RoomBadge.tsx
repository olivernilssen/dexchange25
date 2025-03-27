import { getRoomColorScheme } from '../../utils/roomUtils';

interface RoomDisplayProps {
  room: string;
  isCommon?: boolean;
  dayIndex?: number;
}

export default function RoomBadge({ room, isCommon = false, dayIndex = 0 }: RoomDisplayProps) {
  // Handle common sessions display (Arena or Storsalen based on day)
  const { bg, text } = getRoomColorScheme(room);
  let roomName = room;
  
  if (isCommon) {
    roomName = dayIndex === 0 ? 'Arena' : 'Storsalen';
  }
  
    
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {roomName}
    </span>
  );
}