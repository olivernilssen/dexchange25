import { Day } from '../../types/schedule';

interface DayTabsProps {
  days: Day[];
  activeDay: number;
  showFavorites: boolean;
  onDayChange: (index: number) => void;
  onFavoritesToggle: () => void;
}

export default function DayTabs({ 
  days, 
  activeDay, 
  showFavorites, 
  onDayChange, 
  onFavoritesToggle 
}: DayTabsProps) {
  return (
    <div className="mb-3">
      <div className="flex border-b border-[#8991cd] overflow-x-auto">
        {/* Regular day tabs */}
        {days.map((day, index) => (
          <button
            key={index}
            className={`px-6 py-3 font-medium whitespace-nowrap focus:outline-none ${
              !showFavorites && activeDay === index 
                ? 'border-b-2 border-[#081079] text-[#081079]' 
                : 'text-[#6c7cbc] hover:text-[#081079]'
            }`}
            onClick={() => {
              onDayChange(index);
              if (showFavorites) onFavoritesToggle();
            }}
          >
            Dag {index + 1}
          </button>
        ))}
        
        {/* Favorites tab */}
        <button
          className={`px-6 py-3 font-medium whitespace-nowrap focus:outline-none ml-auto ${
            showFavorites
              ? 'border-b-2 border-[#081079] text-[#081079]' 
              : 'text-[#6c7cbc] hover:text-[#081079]'
          }`}
          onClick={onFavoritesToggle}
        >
          Favoritter <span className="inline-block ml-1">⭐</span>
        </button>
      </div>
    </div>
  );
}