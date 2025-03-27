// Export the formatTime function
export function formatTime(timeString: string) {
  if (!timeString) return '';
  
  // Handle new ISO format (with T)
  if (timeString.includes('T')) {
    const parts = timeString.split('T');
    if (parts.length === 2) {
      return parts[1]; // Already in HH:MM format
    }
  }
  
  // Handle legacy format (with colon)
  const parts = timeString.split(':');
  if (parts.length < 2) return timeString;
  return parts[1].replace('.', ':');
}

// Export the getTimeFromString function
export function getTimeFromString(timeString: string) {
  if (!timeString) return 0;
  try {
    // Handle new ISO format (with T)
    if (timeString.includes('T')) {
      const parts = timeString.split('T');
      if (parts.length === 2) {
        const [hours, minutes] = parts[1].split(':').map(Number);
        return (hours * 60) + minutes;
      }
    }
    
    // Handle legacy format
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        let timePart = parts[1];
        let hours, minutes;
        
        if (timePart.includes('.')) {
          [hours, minutes] = timePart.split('.').map(Number);
        } else if (timePart.includes(':')) {
          [hours, minutes] = timePart.split(':').map(Number);
        } else {
          hours = parseInt(timePart, 10);
          minutes = 0;
        }
        
        return (hours * 60) + minutes;
      }
    }
    return 0;
  } catch (error) {
    console.error(`Error parsing time string: ${timeString}`, error);
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
    return 'border-2 border-[#8da9e4] text-[#081079]'; // Light blue
  } else if (tag.includes('teknologi')) {
    return 'border-2 border-[#b4d9a4] text-[#081079]'; // Light green
  } else if (tag.includes('k8s') || tag.includes('devops') || tag.includes('smud') || tag.includes('leveranse')) {
    return 'border-2 border-[#c3a8e1] text-[#081079]'; // Light purple
  } else if (tag.includes('data') || tag.includes('sikkerhet') || tag.includes('ki')) {
    return 'border-2 border-[#f0d589] text-[#081079]'; // Light yellow 
  } else if (tag.includes('qa')) {
    return 'border-2 border-[#f6a495] text-[#081079]'; // Light salmon
  } else if (tag.includes('sammarbeid') || tag.includes('produkt') || tag.includes('prosess')) {
    return 'border-2 border-[#89c7f0] text-[#081079]'; // Light sky blue
  } else if (tag.includes('utvikling')) {
    return 'border-2 border-[#a8e1d9] text-[#081079]'; // Light teal
  } else if (tag.includes('innovasjon') || tag.includes('modernisering')) {
    return 'border-2 border-[#f4c4e0] text-[#081079]'; // Light pink
  } else if (tag.includes('alle')) {
    return 'border-2 border-[#ffcba4] text-[#081079]'; // Light peach
  } else if (tag.includes('testing')) {
    return 'border-2 border-[#d2e0fb] text-[#081079]'; // Pale blue
  } else if (tag.includes('ekstern')) {
    return 'border-2 border-[#b8d8be] text-[#081079]'; // Soft green
  } else if (tag.includes('web')) {
    return 'border-2 border-[#dbc6eb] text-[#081079]'; // Lavender
  } else if (tag.includes('design')) {
    return 'border-2 border-[#bfd0e0] text-[#081079]'; // Steel blue
  } else if (tag.includes('ytelse')) {
    return 'border-2 border-[#ffecb8] text-[#081079]'; // Pale yellow
  } else if (tag.includes('metode')) {
    return 'border-2 border-[#e0c3fc] text-[#081079]'; // Light violet
  } else if (tag.includes('strategi')) {
    return 'border-2 border-[#c2e5d3] text-[#081079]'; // Mint green
  }
  
  // Default color for other tags
  return 'border-2 border-[#b4bce3] text-[#081079]'; // Default light blue-grey
}