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
      <div className="flex border-b border-primary-border overflow-x-auto">
        {/* Regular day tabs */}
        {days.map((day, index) => (
          <button
            key={index}
            className={`px-6 py-3 font-medium whitespace-nowrap focus:outline-none ${
              !showFavorites && activeDay === index 
                ? 'border-b-2 border-primary-main text-primary-main' 
                : 'text-speech-main hover:text-primary-main'
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
              ? 'border-b-2 border-primary-main text-primary-main' 
              : 'text-speech-main hover:text-primary-main'
          }`}
          onClick={onFavoritesToggle}
        >
          Favoritter <span className="inline-block ml-1">⭐</span>
        </button>
      </div>
    </div>
  );
}