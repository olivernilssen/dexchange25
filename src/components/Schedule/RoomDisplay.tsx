import React from 'react';
import RoomBadge from '../ui/RoomBadge';
import { getRoomNameForSession } from '@/config/rooms';

interface RoomDisplayProps {
  room: string;
  isCommon?: boolean;
  dayIndex: number;
}

export default function RoomDisplay({ 
  room, 
  isCommon = false,
  dayIndex = 0 
}: RoomDisplayProps) {
  // Determine the type based on the room and isCommon flag
  let badgeType: 'common' | 'workshop' | 'speech';
  
  if (isCommon) {
    badgeType = 'common';
  } else if (room.toLowerCase().includes('workshop')) {
    badgeType = 'workshop';
  } else {
    badgeType = 'speech';
  }
  
  return <RoomBadge room={getRoomNameForSession(dayIndex, room)} type={badgeType} />;
}