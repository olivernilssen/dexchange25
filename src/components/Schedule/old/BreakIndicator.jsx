export default function BreakIndicator({ breakItem }) {
    const startTime = getFormattedTime(breakItem.start);
    const endTime = getFormattedTime(breakItem.end);
    
    return (
      <div className="col-span-full bg-[#f6a495] bg-opacity-20 p-2 rounded-md my-1">
        <div className="flex items-center justify-center">
          <span className="text-sm font-medium text-[#081079]">
            {startTime} - {endTime}: {breakItem.title}
          </span>
        </div>
      </div>
    );
  }