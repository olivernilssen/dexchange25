/**
 * Define consistent room order for different days
 */
export const ROOM_ORDER_BY_DAY: Record<number, string[]> = {
  0: ['Arena', 'Klasserom', 'Kantina', 'Landegode'], // Day 1
  1: ['Storsalen', 'Storsal 1', 'Storsal 2', 'Storsal 3', 'The Social', 'Saltstraumen', 'Salten']  // Day 2
};

/**
 * Get the primary room for a day
 */
export function getRoomNameForSession(dayIndex: number, roomName: string): string {
  console.log('dayIndex:', dayIndex);
  if (roomName === 'Felles') {
    return dayIndex === 0 ? 'Arena' : 'Storsalen';
  }
  return roomName;
}