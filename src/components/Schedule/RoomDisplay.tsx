import { RoomBadge } from '../../utils/roomUtils';

interface RoomDisplayProps {
  room: string;
  isCommon?: boolean;
  dayIndex?: number;
}

export default function RoomDisplay({ room, isCommon = false, dayIndex = 0 }: RoomDisplayProps) {
  // Handle common sessions display (Arena or Storsalen based on day)
  if (isCommon) {
    return <RoomBadge room={dayIndex === 0 ? 'Arena' : 'Storsalen'} />;
  }
  
  // Regular room
  return <RoomBadge room={room} />;
}