// Helper function to format time from "2025-04-09:10.30" to "10:30"
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  return parts[1].replace('.', ':');
}

// Get a comparable time value from a string
export function getTimeFromString(timeString: string): number {
  if (!timeString) return 0;
  
  try {
    if (timeString.includes(':')) {
      // Handle format like "2025-04-09:10.30" or "2025-04-09:17.15"
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        // Get the time part
        let timePart = parts[1];
        
        // Check if it contains a period (like 10.30) or a colon (like 10:30)
        let hours, minutes;
        
        if (timePart.includes('.')) {
          [hours, minutes] = timePart.split('.').map(Number);
        } else if (timePart.includes(':')) {
          [hours, minutes] = timePart.split(':').map(Number);
        } else {
          // If it's just a number like "17"
          hours = parseInt(timePart, 10);
          minutes = 0;
        }
        
        // Safety check and convert to minutes
        if (!isNaN(hours) && !isNaN(minutes)) {
          return hours * 60 + minutes; // Convert to hours and minutes for comparison
        }
      }
    }
    
    console.warn(`Failed to parse time: "${timeString}"`);
    return 0;
  } catch (e) {
    console.error(`Error parsing time string "${timeString}":`, e);
    return 0;
  }
}

// Format minutes (e.g. 1035) as time (17:15)
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? '0' + mins : mins}`;
}

// Date formatting helper
export function formatDate(dateInput: any, dayIndex: number = 0): string {
  // Implementation remains the same
  const date = new Date(dateInput);
  if (dayIndex) {
    date.setDate(date.getDate() + dayIndex);
  }
  return date.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Short date formatting helper
export function formatShortDate(dateInput: any, dayIndex: number = 0): string {
  const date = new Date(dateInput);
  if (dayIndex) {
    date.setDate(date.getDate() + dayIndex);
  }
  return date.toLocaleDateString('no-NO', { month: 'short', day: 'numeric' });
}

// Get tag color based on content
export function getTagColor(tagName: string): string {
  // Convert to lowercase for case-insensitive matching
  const tag = tagName.trim().toLowerCase();
  
  // Map tags to specific colors
  if (tag.includes('frontend')) {
    return 'bg-[#8da9e4] text-[#081079]'; // Light blue
  } else if (tag.includes('teknologi')) {
    return 'bg-[#b4d9a4] text-[#081079]'; // Light green
  } else if (tag.includes('k8s') || tag.includes('devops') || tag.includes('deploy') || tag.includes('leveranse')) {
    return 'bg-[#c3a8e1] text-[#081079]'; // Light purple
  } else if (tag.includes('data') || tag.includes('ai') || tag.includes('ki')) {
    return 'bg-[#f0d589] text-[#081079]'; // Light yellow 
  } else if (tag.includes('brukervennlighet') || tag.includes('qa')) {
    return 'bg-[#f6a495] text-[#081079]'; // Light salmon
  } else if (tag.includes('sammarbeid') || tag.includes('produkt') || tag.includes('strategi') || tag.includes('prosess')) {
    return 'bg-[#89c7f0] text-[#081079]'; // Light sky blue
  } else if (tag.includes('utvikling') || tag.includes('ux') || tag.includes('ui')) {
    return 'bg-[#a8e1d9] text-[#081079]'; // Light teal
  }
  
  // Default color for other tags
  return 'bg-[#b4bce3] text-[#081079]'; // Default light blue-grey
}