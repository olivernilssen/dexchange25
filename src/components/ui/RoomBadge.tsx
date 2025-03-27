import React from 'react';

interface RoomBadgeProps {
  room: string;
  type: 'common' | 'workshop' | 'speech';
  className?: string;
}

export default function RoomBadge({ 
  room, 
  type, 
  className = '' 
}: RoomBadgeProps) {
  const getBadgeClasses = () => {
    switch (type) {
      case 'common':
        return 'bg-common-main/10 text-common-text';
      case 'workshop':
        return 'bg-workshop-main/10 text-workshop-text';
      default:
        return 'bg-speech-main/10 text-speech-text';
    }
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${getBadgeClasses()} ${className}`}>
      {room}
    </span>
  );
}