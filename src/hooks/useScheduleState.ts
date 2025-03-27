import { useState, useEffect, useCallback } from 'react';
import { ScheduleData, Session } from '../types/schedule';
import { getTimeFromString } from '../utils/timeUtils';

export function useScheduleState(scheduleData: ScheduleData) {
  // Load saved tab state from localStorage
  const [activeDay, setActiveDay] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedDay = localStorage.getItem('activeDay');
      return savedDay ? parseInt(savedDay) : 0;
    }
    return 0;
  });
  
  const [showFavorites, setShowFavorites] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedShowFavorites = localStorage.getItem('showFavorites');
      return savedShowFavorites === 'true';
    }
    return false;
  });
  
  const [selectedSession, setSelectedSession] = useState<(Session & { room?: string }) | null>(null);
  const [testCurrentTime, setTestCurrentTime] = useState<string | undefined>(undefined);

  // Save tab state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeDay', activeDay.toString());
    localStorage.setItem('showFavorites', showFavorites.toString());
  }, [activeDay, showFavorites]);

  // Helper functions
  const handleDayChange = useCallback((index: number) => {
    setActiveDay(index);
  }, []);

  const handleFavoritesToggle = useCallback(() => {
    setShowFavorites(!showFavorites);
  }, [showFavorites]);

  const handleSessionClick = useCallback((session: Session & { room?: string }) => {
    setSelectedSession(session);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedSession(null);
  }, []);

  const isSessionCompleted = useCallback((session: Session): boolean => {
    const now = testCurrentTime
      ? new Date(`${scheduleData.schedule.days[activeDay].date}T${testCurrentTime}`) // Using provided test time
      : new Date();

    // If the time is invalid, return false
    if (isNaN(now.getTime())) {
      return false;
    }

    const sessionEndTime = new Date(`${scheduleData.schedule.days[activeDay].date}T${session.end}`);
    return now > sessionEndTime;
  }, [activeDay, scheduleData.schedule.days, testCurrentTime]);

  return {
    activeDay,
    showFavorites,
    selectedSession,
    testCurrentTime,
    handleDayChange,
    handleFavoritesToggle,
    handleSessionClick,
    closeModal,
    isSessionCompleted,
    setTestCurrentTime
  };
}