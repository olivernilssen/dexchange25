import React from 'react';
import { Break } from '../../types/schedule';
import { formatTime } from '../../utils/timeUtils';

interface BreakCardProps {
  breakItem: Break;
}

export default function BreakCard({ breakItem }: BreakCardProps) {
  return (
    <div className="relative p-3 bg-break-light rounded border-l-4 border-break-main text-sm shadow-sm w-full">
      <div className="font-medium text-break-text">
        {breakItem.title}
      </div>
      <div className="text-primary-light text-xs mt-1">
        {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
      </div>
    </div>
  );
}