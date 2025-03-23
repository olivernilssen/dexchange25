// Helper function to format time strings from "2025-04-09:10.30" to "10:30"
export function formatTime(timeString) {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length < 2) return timeString;
    return parts[1].replace('.', ':');
  }
  
  // Format: "2025-04-09:10.30" to "April 9"
  export function formatDate(dateTimeString) {
    if (!dateTimeString) return '';
    const dateStr = dateTimeString.split(':')[0];
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  }
  
  // Format: "2025-04-09:10.30" to "Wednesday, April 9"
  export function formatFullDate(dateTimeString) {
    if (!dateTimeString) return '';
    const dateStr = dateTimeString.split(':')[0];
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  }