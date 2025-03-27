import { SESSION_COLORS, CARD_STYLES } from './theme';

/**
 * Get all session card styles based on type
 */
export function getSessionCardStyles(isCommon: boolean, isWorkshop: boolean) {
  let style = isCommon 
    ? SESSION_COLORS.common 
    : isWorkshop 
      ? SESSION_COLORS.workshop 
      : SESSION_COLORS.speech;
      
  return {
    card: `${CARD_STYLES.base} ${CARD_STYLES.bordered} ${style.border} ${style.bg}`,
    hover: style.hoverBg,
    timeText: style.textColor,
    badge: `${style.badgeBg} ${style.badgeText}`,
  };
}

/**
 * Get badge style based on type
 */
export function getSessionBadgeStyle(type: string) {
  switch(type.toLowerCase()) {
    case 'workshop':
      return 'bg-[#e05252] text-white';
    case 'speech':
    case 'foredrag':
      return 'bg-[#3949ab] text-white';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}