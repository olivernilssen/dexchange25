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
    <div className="relative p-2 bg-[#f8f0e5] rounded border-l-4 border-[#c98376] text-sm shadow-sm">
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-[#c98376] border-2 border-white"></div>
      <div className="font-medium text-[#c98376]">{breakItem.title}</div>
      <div className="text-[#6c7cbc] text-xs">
        {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
      </div>
    </div>
  );
}