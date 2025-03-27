// Color constants and style themes

// Session type colors
export const SESSION_COLORS = {
  // Common/Felles sessions (yellow theme)
  common: {
    border: 'border-common-main',
    bg: 'bg-common-light/20',
    hoverBg: 'hover:bg-common-hover',
    textColor: 'text-common-text',
    badgeBg: 'bg-common-main',
    badgeText: 'text-neutral-text-primary',
  },
  // Workshop sessions (coral theme)
  workshop: {
    border: 'border-workshop-main',
    bg: 'bg-workshop-light/20',
    hoverBg: 'hover:bg-workshop-hover',
    textColor: 'text-workshop-text',
    badgeBg: 'bg-workshop-main',
    badgeText: 'text-white',
  },
  // Talk/speech sessions (blue theme)
  speech: {
    border: 'border-speech-main',
    bg: 'bg-speech-light/20',
    hoverBg: 'hover:bg-speech-hover',
    textColor: 'text-speech-text',
    badgeBg: 'bg-speech-main',
    badgeText: 'text-white',
  }
};

// Common button styles
export const BUTTON_STYLES = {
  primary: 'bg-primary-main text-white font-medium py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors',
  secondary: 'bg-palette-blue/20 text-primary-dark font-medium py-2 px-4 rounded-lg hover:bg-palette-blue/30 transition-colors',
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
  container: 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-palette-purple/20 text-palette-purple',
};

// Common UI element styles
export const UI_ELEMENTS = {
  badge: 'px-2 py-0.5 text-xs rounded',
  pill: 'px-2 py-0.5 text-xs rounded-full',
  smallPill: 'px-1.5 py-0.5 text-xs rounded-full',
};