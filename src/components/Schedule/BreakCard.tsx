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
    <div className="relative p-3 bg-[#f8f0e5] rounded border-l-4 border-[#c98376] text-sm shadow-sm w-full">
      <div className="font-medium text-[#c98376]">{breakItem.title}</div>
      <div className="text-[#6c7cbc] text-xs mt-1">
        {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
      </div>
    </div>
  );
}