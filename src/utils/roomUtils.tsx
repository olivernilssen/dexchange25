// Simple utility to assign consistent colors to rooms

type RoomColorScheme = {
  bg: string;
  text: string;
};

// Predefined colors for specific rooms, with high contrast color combinations
const ROOM_COLORS: Record<string, RoomColorScheme> = {
  // Default room (used for backup)
  default: { bg: 'bg-gray-600', text: 'text-white' },
  
  // Predefined room colors - adjust these to match your actual room names
  'Felles': { bg: 'bg-blue-600', text: 'text-white' },
  'Arena': { bg: 'bg-blue-600', text: 'text-white' },
  'Klasserom': { bg: 'bg-purple-600', text: 'text-white' },
  'Kantina': { bg: 'bg-green-600', text: 'text-white' },
  'Landegode': { bg: 'bg-lime-600', text: 'text-white' },
  'Storsalen': { bg: 'bg-yellow-600', text: 'text-white' },
  'Storsal 1': { bg: 'bg-purple-600', text: 'text-white' },
  'Storsal 2': { bg: 'bg-green-600', text: 'text-white' },
  'Storsal 3': { bg: 'bg-lime-600', text: 'text-white' },
  'The Social': { bg: 'bg-emerald-600', text: 'text-white' },
  'Saltstraumen': { bg: 'bg-fuchsia-600', text: 'text-white' },
  'Salten': { bg: 'bg-violet-600', text: 'text-white' },
  };

// Algorithmic room coloring for rooms not in the predefined list
const FALLBACK_COLORS: RoomColorScheme[] = [
  { bg: 'bg-cyan-600', text: 'text-white' },
  { bg: 'bg-emerald-600', text: 'text-white' },
  { bg: 'bg-rose-600', text: 'text-white' },
  { bg: 'bg-amber-600', text: 'text-white' },
  { bg: 'bg-lime-600', text: 'text-white' },
  { bg: 'bg-sky-600', text: 'text-white' },
  { bg: 'bg-violet-600', text: 'text-white' },
  { bg: 'bg-fuchsia-600', text: 'text-white' },
];

// Keep track of which fallback colors we've assigned
const roomColorMap = new Map<string, RoomColorScheme>();
let nextFallbackColorIndex = 0;

/**
 * Gets a consistent color scheme for a given room
 */
export function getRoomColorScheme(roomName: string): RoomColorScheme {
  // 1. Return predefined color if it exists
  if (ROOM_COLORS[roomName]) {
    return ROOM_COLORS[roomName];
  }
  
  // 2. Return from map if we've already assigned a color to this room
  if (roomColorMap.has(roomName)) {
    return roomColorMap.get(roomName)!;
  }
  
  // 3. Assign a new color from the fallback list
  const colorScheme = FALLBACK_COLORS[nextFallbackColorIndex % FALLBACK_COLORS.length];
  roomColorMap.set(roomName, colorScheme);
  nextFallbackColorIndex++;
  
  return colorScheme;
}

/**
 * Returns a room badge component with the appropriate colors
 */
export function RoomBadge({ room }: { room: string }) {
  const { bg, text } = getRoomColorScheme(room);
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
      {room}
    </span>
  );
}