import { Dispatch, SetStateAction, useState, useEffect } from 'react';

interface DebugControlsProps {
  setTestCurrentTime: Dispatch<SetStateAction<string | undefined>>;
}

export default function DebugControls({ setTestCurrentTime }: DebugControlsProps) {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  const [dateTimeValue, setDateTimeValue] = useState<string>('');
  const [activeTime, setActiveTime] = useState<string | undefined>();
  
  // Format current date-time in the required format
  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };
  
  // Apply the selected time
  const applyTime = () => {
    if (dateTimeValue) {
      setTestCurrentTime(dateTimeValue);
      setActiveTime(dateTimeValue);
    }
  };
  
  // Set to current time
  const setToCurrentTime = () => {
    const currentTime = getCurrentDateTime();
    setDateTimeValue(currentTime);
    setTestCurrentTime(currentTime);
    setActiveTime(currentTime);
  };
  
  // Reset time
  const resetTime = () => {
    setTestCurrentTime(undefined);
    setDateTimeValue('');
    setActiveTime(undefined);
  };
  
  // Format time for display
  const formatTimeForDisplay = (timeString: string): string => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString();
    } catch (e) {
      return timeString;
    }
  };
  
  return (
    <div className="mt-8 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm">
      <h3 className="font-medium text-black mb-3 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Debug Time Controls
      </h3>
      
      {activeTime && (
        <div className="mb-3 text-sm bg-blue-50 p-2 rounded border border-blue-200">
          <span className="font-semibold">Active Test Time:</span> {formatTimeForDisplay(activeTime)}
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center text-black">
          <label className="mr-2 text-sm font-medium">Set Time:</label>
          <input 
            type="datetime-local" 
            value={dateTimeValue}
            className="border border-gray-300 px-2 py-1 rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
            onChange={(e) => setDateTimeValue(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={applyTime}
            disabled={!dateTimeValue}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Apply Time
          </button>
          
          <button
            onClick={setToCurrentTime}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
          >
            Use Current Time
          </button>
          
          <button
            onClick={resetTime}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            Reset
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-3 italic">
        Use these controls to simulate different times for testing schedule-dependent features.
      </p>
    </div>
  );
}