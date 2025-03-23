/**
 * Formats a date to YYYY-MM-DD string for consistent comparison
 * Can handle various input formats
 */
export function formatDateForComparison(date: string | Date | undefined): string | undefined {
  if (!date) return undefined;
  
  // If already in YYYY-MM-DD format, return as is
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Parse the date
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Check if valid date
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return undefined;
    }
    
    // Format to YYYY-MM-DD using ISO string and taking just the date part
    return dateObj.toISOString().split('T')[0];
  } catch (e) {
    console.error('Error formatting date:', date, e);
    return undefined;
  }
}

/**
 * Debug function to demonstrate how date comparison works
 */
export function debugDateComparison(dateA: string, dateB: string): void {
  console.log('------ Date Comparison Debug ------');
  console.log('Date A (raw):', dateA);
  console.log('Date B (raw):', dateB);
  
  // Format both dates
  const formattedA = formatDateForComparison(dateA);
  const formattedB = formatDateForComparison(dateB);
  
  console.log('Date A (formatted):', formattedA);
  console.log('Date B (formatted):', formattedB);
  
  if (!formattedA || !formattedB) {
    console.log('Unable to compare - one or both dates are invalid');
    return;
  }
  
  console.log('A < B:', formattedA < formattedB);
  console.log('A == B:', formattedA === formattedB);
  console.log('A > B:', formattedA > formattedB);
  console.log('----------------------------------');
}