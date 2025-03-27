// Color constants and style themes

// Session type colors
export const SESSION_COLORS = {
  // Common/Felles sessions (yellow theme)
  common: {
    border: 'border-[#f0b429]',
    bg: 'bg-[#fffbf0]',
    hoverBg: 'hover:bg-[#fff7e0]',
    textColor: 'text-[#b88a00]',
    badgeBg: 'bg-[#f0b429]',
    badgeText: 'text-white',
  },
  // Workshop sessions (red theme)
  workshop: {
    border: 'border-[#e05252]',
    bg: 'bg-[#fff5f5]',
    hoverBg: 'hover:bg-[#fff0f0]',
    textColor: 'text-[#e05252]',
    badgeBg: 'bg-[#e05252]',
    badgeText: 'text-white',
  },
  // Talk/speech sessions (blue theme)
  speech: {
    border: 'border-[#3949ab]',
    bg: 'bg-[#f5f7ff]',
    hoverBg: 'hover:bg-[#f0f2fa]',
    textColor: 'text-[#3949ab]',
    badgeBg: 'bg-[#3949ab]',
    badgeText: 'text-white',
  }
};

// Common button styles
export const BUTTON_STYLES = {
  primary: 'bg-[#081079] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#060d4d] transition-colors',
  secondary: 'bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors',
};

// Standardize badge styles
export const BADGE_STYLES = {
  // Base styles for all badges
  base: 'inline-flex items-center text-xs font-medium',
  
  // Shapes
  pill: 'rounded-full px-2 py-0.5',
  tag: 'rounded px-2 py-0.5',
  
  // Specific badge types
  room: 'rounded-full px-2 py-0.5',
  sessionType: 'rounded px-2 py-0.5',
  contentTag: 'rounded px-2 py-0.5',
};

// Card styles
export const CARD_STYLES = {
  base: 'relative rounded shadow cursor-pointer transition-colors',
  bordered: 'border-l-4',
};

// Room badge styling
export const ROOM_BADGE_STYLES = {
  container: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
  // You can add more specific styles if needed
};

// Common UI element styles
export const UI_ELEMENTS = {
  badge: 'px-2 py-0.5 text-xs rounded',
  pill: 'px-2 py-0.5 text-xs rounded-full',
  smallPill: 'px-1.5 py-0.5 text-xs rounded-full',
};