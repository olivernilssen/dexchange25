import React from 'react';
import { formatTime } from '../../utils/timeUtils';

interface SessionTimeDisplayProps {
  startTime: string;
  endTime: string;
  isCompleted?: boolean;
  type: 'common' | 'workshop' | 'speech';
}

export default function SessionTimeDisplay({ 
  startTime, 
  endTime, 
  isCompleted = false,
  type
}: SessionTimeDisplayProps) {
  // Define the text color based on the session type
  const textColorClass = 
    type === 'common' ? 'text-common-text' :
    type === 'workshop' ? 'text-workshop-text' :
    'text-speech-text';
    

  return (
    <div className={`text-xs font-medium ${textColorClass}`}>
      {formatTime(startTime)} - {formatTime(endTime)}
      {isCompleted && <span className="text-green-500 ml-2">(Completed)</span>}
    </div>
  );
}