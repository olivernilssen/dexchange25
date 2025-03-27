import { getTimeFromString, formatTime } from './timeUtils';
import { Day, Session } from '../types/schedule';
import { Break, TimelineItem, TimeBlock } from '../types/schedule';

/**
 * Collects all sessions and breaks into a single array
 */
export function collectTimelineItems(day: Day, breaks: Break[]): TimelineItem[] {
  const allItems: TimelineItem[] = [];
  
  // Add room sessions
  if (day.tracks) {
    day.tracks.forEach(track => {
      if (track.sessions) {
        track.sessions.forEach(session => {
          allItems.push({
            ...session,
            isBreak: false,
            startTime: getTimeFromString(session.start),
            endTime: getTimeFromString(session.end),
            room: track.room || "Unknown"
          });
        });
      }
    });
  }
  
  // Add common sessions
  if (day.commonSessions) {
    day.commonSessions.forEach(session => {
      allItems.push({
        ...session,
        isBreak: false,
        startTime: getTimeFromString(session.start),
        endTime: getTimeFromString(session.end),
        room: session.room || "Felles", // Use session.room if it exists, fallback to "Felles"
        isCommon: true
      });
    });
  }
  
  // Add breaks
  if (breaks && breaks.length > 0) {
    breaks.forEach(breakItem => {
      allItems.push({
        ...breakItem,
        isBreak: true,
        startTime: getTimeFromString(breakItem.start),
        endTime: getTimeFromString(breakItem.end)
      });
    });
  }
  
  return allItems;
}

/**
 * Find connected sessions across the timeline
 */
export function findConnectedSessions(items: TimelineItem[]): {
  connectedGroups: (TimelineItem & { isBreak: false })[][];
  processedItems: Set<string>;
} {
  try {
    // Group sessions by room
    const sessionsByRoom: Record<string, (TimelineItem & { isBreak: false })[]> = {};
    
    // Only consider non-break items
    const nonBreakItems = items.filter(item => !item.isBreak);
    
    nonBreakItems.forEach(session => {
      const item = session as TimelineItem & { isBreak: false };
      const room = item.room;
      
      if (!sessionsByRoom[room]) {
        sessionsByRoom[room] = [];
      }
      
      sessionsByRoom[room].push(item);
    });
    
    // Find connected sessions (sessions that happen back-to-back in the same room)
    const connectedGroups: (TimelineItem & { isBreak: false })[][] = [];
    const processedItems = new Set<string>();
    
    Object.entries(sessionsByRoom).forEach(([room, roomSessions]) => {
      // Skip if only one session in this room
      if (roomSessions.length <= 1) return;
      
      // Regular room or common sessions room
      const isCommonRoom = room === "Felles";
      
      // Sort by start time
      roomSessions.sort((a, b) => a.startTime - b.startTime);
      
      // Create a copy to track sessions we've looked at
      const unprocessedSessions = [...roomSessions];
      
      while (unprocessedSessions.length > 0) {
        // Process connected sessions logic (same as original)
        const currentGroup = [unprocessedSessions.shift()!];
        let lastSessionInGroup = currentGroup[0];
        let expandedGroup = true;
        
        while (expandedGroup) {
          expandedGroup = false;
          
          for (let i = 0; i < unprocessedSessions.length; i++) {
            const nextSession = unprocessedSessions[i];
            
            if (nextSession.start === lastSessionInGroup.end && 
                (!isCommonRoom || (!!nextSession.isCommon === !!lastSessionInGroup.isCommon))) {
              
              currentGroup.push(nextSession);
              lastSessionInGroup = nextSession;
              unprocessedSessions.splice(i, 1);
              expandedGroup = true;
              break;
            }
          }
        }
        
        if (currentGroup.length > 1) {
          currentGroup.forEach(session => {
            const sessionKey = `${session.title}-${session.start}`;
            processedItems.add(sessionKey);
          });
          
          connectedGroups.push(currentGroup);
        }
      }
    });
    
    return {
      connectedGroups,
      processedItems
    };
  } catch (error) {
    console.error("Error in findConnectedSessions:", error);
    return { connectedGroups: [], processedItems: new Set() };
  }
}

/**
 * Process all items into time blocks
 */
export function createTimeBlocks(
  allItems: TimelineItem[], 
  connectedGroups: TimelineItem[][], 
  processedItems: Set<string>
): TimeBlock[] {
  // Filter out items in connected groups
  const filteredItems = allItems.filter(item => {
    if (item.isBreak) return true;
    const sessionKey = `${item.title}-${item.start}`;
    return !processedItems.has(sessionKey);
  });
  
  // Add placeholders for connected groups
  const connectedPlaceholders = connectedGroups.map(group => {
    if (!group.length) return null; // Safety check for empty groups
    
    group.sort((a, b) => a.startTime - b.startTime);
    
    // Explicitly cast the first item to the non-break version of TimelineItem
    const firstItem = group[0] as (TimelineItem & { isBreak: false });
    const lastItem = group[group.length - 1] as (TimelineItem & { isBreak: false });
    
    return {
      isBreak: false,
      isConnectedGroup: true,
      startTime: firstItem.startTime,
      endTime: lastItem.endTime,
      group: group,
      room: firstItem.room, // Now TypeScript knows this is safe
      start: firstItem.start,
      end: lastItem.end,
      title: firstItem.title
    };
  }).filter((item): item is NonNullable<typeof item> => item !== null);
  
  // Combine and sort
  const combinedItems = [...filteredItems, ...connectedPlaceholders];
  combinedItems.sort((a, b) => {
    // Sort primarily by start time
    const startDiff = a.startTime - b.startTime;
    if (startDiff !== 0) return startDiff;
    
    // If start times are equal, sort breaks before sessions
    if (a.isBreak && !b.isBreak) return -1;
    if (!a.isBreak && b.isBreak) return 1;
    
    // Otherwise, sort by room - only for non-break items
    if (!a.isBreak && !b.isBreak) {
      // Both are session items, safe to access room
      const roomA = 'room' in a ? a.room : '';
      const roomB = 'room' in b ? b.room : '';
      return roomA.localeCompare(roomB);
    }
    
    return 0;
  });
  
  // Create time blocks
  const timeBlocks: TimeBlock[] = [];
  let currentTime: number | null = null;
  let currentBlock: any[] = [];
  
  // Group items by their start time
  combinedItems.forEach(item => {
    if (currentTime === null || item.startTime !== currentTime) {
      // When time changes, push the current block and start a new one
      if (currentBlock.length > 0 && currentTime !== null) {
        const displayTime = currentBlock[0].isBreak
          ? formatTime(currentBlock[0].start)
          : formatTime(currentBlock[0].start);
          
        timeBlocks.push({
          time: currentTime,
          displayTime,
          items: [...currentBlock]
        });
      }
      
      currentTime = item.startTime;
      currentBlock = [item];
    } else {
      // Same time, add to current block
      currentBlock.push(item);
    }
  });
  
  // Add the last block
  if (currentBlock.length > 0 && currentTime !== null) {
    const displayTime = currentBlock[0].isBreak
      ? formatTime(currentBlock[0].start)
      : formatTime(currentBlock[0].start);
      
    timeBlocks.push({
      time: currentTime,
      displayTime,
      items: [...currentBlock]
    });
  }
  
  return timeBlocks;
}