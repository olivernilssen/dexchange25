import { Session } from '../types/schedule';
import { getTimeFromString } from './timeUtils';
import { formatDateForComparison } from './dateUtils';

/**
 * Determines if a session is completed based on current or test date/time
 */
export function isSessionCompleted(
  session: Session,
  dayDate: string | undefined,
  testDate?: string,
  testTime?: string
): boolean {
  // Get the current date in YYYY-MM-DD format
  const today = new Date();
  const currentDateStr = testDate || 
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Format dates for consistent comparison
  const formattedDayDate = formatDateForComparison(dayDate);
  const formattedCurrentDate = formatDateForComparison(currentDateStr);
  
  // If we can't format the dates properly, assume not completed
  if (!formattedDayDate || !formattedCurrentDate) {
    return false;
  }
  
  // If day is in the past, all sessions are completed
  if (formattedDayDate < formattedCurrentDate) {
    return true;
  }
  
  // If day is in the future, no sessions are completed
  if (formattedDayDate > formattedCurrentDate) {
    return false;
  }
  
  // For today, compare session end time with current/test time
  // Get current time in minutes (e.g., 9:30 AM = 570 minutes)
  let currentTimeMinutes: number;
  
  if (testTime) {
    // Use test time if provided
    const [hours, minutes] = testTime.split(':').map(Number);
    currentTimeMinutes = hours * 60 + minutes;
  } else {
    // Use actual current time
    const now = new Date();
    currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
  }
  
  // Get session end time in minutes
  const sessionEndMinutes = getTimeFromString(session.end);
  
  // Session is completed if it has ended (end time is before current time)
  return sessionEndMinutes < currentTimeMinutes;
}

/**
 * Debug function to log session completion details
 */
export function debugSessionCompletion(
  session: Session,
  dayDate: string | undefined,
  testDate?: string,
  testTime?: string
): boolean {
  // Format dates for logging
  const formattedDayDate = formatDateForComparison(dayDate);
  
  const today = new Date();
  const currentDateStr = testDate || 
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const formattedCurrentDate = formatDateForComparison(currentDateStr);
  
  // Get current time in minutes
  let currentTimeMinutes: number;
  let timeSource: string;
  
  if (testTime) {
    // Use test time if provided
    const [hours, minutes] = testTime.split(':').map(Number);
    currentTimeMinutes = hours * 60 + minutes;
    timeSource = `test time (${testTime})`;
  } else {
    // Use actual current time
    const now = new Date();
    currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    timeSource = `current time (${Math.floor(currentTimeMinutes/60)}:${String(currentTimeMinutes%60).padStart(2, '0')})`;
  }
  
  // Get session end time in minutes
  const sessionEndMinutes = getTimeFromString(session.end);
  
  // Determine completion status
  const isPastDay = !!formattedDayDate && !!formattedCurrentDate && formattedDayDate < formattedCurrentDate;
  const isToday = !!formattedDayDate && !!formattedCurrentDate && formattedDayDate === formattedCurrentDate;
  const hasEnded = sessionEndMinutes < currentTimeMinutes;
  
  const isCompleted = isPastDay || (isToday && hasEnded);
  
  // Log details
  console.group(`📆 Session Completion Check: "${session.title}"`);
  console.log('Day date:', formattedDayDate);
  console.log('Compare date:', formattedCurrentDate);
  console.log('Day status:', isPastDay ? 'Past day' : (isToday ? 'Today' : 'Future day'));
  
  if (isToday) {
    console.log('Session end:', session.end, `(${sessionEndMinutes} minutes)`);
    console.log('Current time:', `${Math.floor(currentTimeMinutes/60)}:${String(currentTimeMinutes%60).padStart(2, '0')}`, `(${currentTimeMinutes} minutes)`);
    console.log('Session ended:', hasEnded ? 'Yes' : 'No');
  }
  
  console.log('Completion status:', isCompleted ? 'COMPLETED' : 'ACTIVE');
  console.groupEnd();

  return isCompleted;
}