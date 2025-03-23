import { formatTime } from '../../utils/timeFormatters';

export default function BreaksList({ breaks }) {
  if (!breaks || breaks.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h4 className="font-medium text-[#c98376] mb-2">Breaks</h4>
      <div className="space-y-2">
        {breaks.map((breakItem, idx) => (
          <div key={idx} className="bg-[#f6a495] bg-opacity-10 p-3 rounded">
            <div className="font-medium">{breakItem.title}</div>
            <div className="text-sm text-gray-600">
              {formatTime(breakItem.start)} - {formatTime(breakItem.end)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}