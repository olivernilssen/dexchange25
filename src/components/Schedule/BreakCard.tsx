import { formatTime } from '../../utils/timeUtils';

interface BreakCardProps {
  breakItem: {
    title: string;
    start: string;
    end: string;
  };
}

export default function BreakCard({ breakItem }: BreakCardProps) {
  return (
    <div className="relative p-3 bg-break2-light rounded border-l-4 border-break2-main text-sm shadow-sm w-full">
      <div className="font-medium text-break2-text">{breakItem.title}</div>
      <div className="text-speech-main text-xs mt-1">
        {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
      </div>
    </div>
  );
}