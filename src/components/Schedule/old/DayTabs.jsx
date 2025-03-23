export default function DayTabs({ days, activeDay, setActiveDay }) {
  return (
    <div className="flex mb-6 border-b">
      {days.map((day, index) => (
        <button
          key={index}
          className={`px-4 py-2 font-medium ${
            activeDay === index 
              ? 'border-b-2 border-[#081079] text-[#081079]' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveDay(index)}
        >
          {new Date(day.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </button>
      ))}
    </div>
  );
}