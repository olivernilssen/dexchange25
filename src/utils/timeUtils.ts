// Export the formatTime function
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  
  // Handle simple HH:MM format
  if (timeString.match(/^\d{1,2}:\d{2}$/)) {
    return timeString;
  }
  
  try {
    // Try to parse as ISO date if it's a full date string
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString('nb-NO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    }
  } catch (e) {
    console.error('Error formatting time:', e);
  }
  
  // Return original if parsing fails
  return timeString;
}

export function getTimeFromString(timeString: string): number {
  if (!timeString) return 0;
  
  try {
    // If format is HH:MM
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  } catch (e) {
    console.error('Error parsing time:', e);
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
  } else if (tag.includes('k8s') || tag.includes('devops') || tag.includes('smud') || tag.includes('leveranse')) {
    return 'bg-[#c3a8e1] text-[#081079]'; // Light purple
  } else if (tag.includes('data') || tag.includes('sikkerhet') || tag.includes('ki')) {
    return 'bg-[#f0d589] text-[#081079]'; // Light yellow 
  } else if (tag.includes('qa')) {
    return 'bg-[#f6a495] text-[#081079]'; // Light salmon
  } else if (tag.includes('sammarbeid') || tag.includes('produkt') || tag.includes('prosess')) {
    return 'bg-[#89c7f0] text-[#081079]'; // Light sky blue
  } else if (tag.includes('utvikling')) {
    return 'bg-[#a8e1d9] text-[#081079]'; // Light teal
  } else if (tag.includes('innovasjon') || tag.includes('modernisering')) {
    return 'bg-[#f4c4e0] text-[#081079]'; // Light pink
  } else if (tag.includes('alle')) {
    return 'bg-[#ffcba4] text-[#081079]'; // Light peach
  } else if (tag.includes('testing')) {
    return 'bg-[#d2e0fb] text-[#081079]'; // Pale blue
  } else if (tag.includes('ekstern')) {
    return 'bg-[#b8d8be] text-[#081079]'; // Soft green
  } else if (tag.includes('web')) {
    return 'bg-[#dbc6eb] text-[#081079]'; // Lavender
  } else if (tag.includes('design')) {
    return 'bg-[#bfd0e0] text-[#081079]'; // Steel blue
  } else if (tag.includes('ytelse')) {
    return 'bg-[#ffecb8] text-[#081079]'; // Pale yellow
  } else if (tag.includes('metode')) {
    return 'bg-[#e0c3fc] text-[#081079]'; // Light violet
  } else if (tag.includes('strategi')) {
    return 'bg-[#c2e5d3] text-[#081079]'; // Mint green
  }
  
  // Default color for other tags
  return 'bg-[#b4bce3] text-[#081079]'; // Default light blue-grey
}