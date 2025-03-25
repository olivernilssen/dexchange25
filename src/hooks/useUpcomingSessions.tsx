"use client";

import { useState, useEffect } from 'react';
import { getTimeFromString } from '../utils/timeUtils';
import { Day, Session } from '../types/schedule';

export function useUpcomingSessions(day: Day, currentTime?: string) {
  const [nextSessions, setNextSessions] = useState<Array<Session & { room: string }>>([]);
  const [sessionsByRoom, setSessionsByRoom] = useState<{[key: string]: Array<Session & { room: string }>}>({});
  
  // Function to find upcoming sessions
  const findUpcomingSessions = () => {
    if (!day || !day.tracks) return [];
    
    // Get current time in minutes
    let now: number;
    if (currentTime) {
      now = getTimeFromString(currentTime);
    } else {
      const date = new Date();
      now = date.getHours() * 60 + date.getMinutes();
    }
    
    // Collect all sessions with their rooms
    const allSessions: Array<Session & { room: string }> = [];
    
    // Add room sessions
    day.tracks.forEach(track => {
      if (track.sessions) {
        track.sessions.forEach(session => {
          allSessions.push({
            ...session,
            room: track.room
          });
        });
      }
    });
    
    // Add common sessions
    if (day.commonSessions) {
      day.commonSessions.forEach(session => {
        allSessions.push({
          ...session,
          room: "Felles"
        });
      });
    }
    
    // Find sessions that haven't started yet
    const upcomingSessions = allSessions.filter(session => {
      const startTime = getTimeFromString(session.start);
      return startTime > now;
    });
    
    // Sort by start time
    upcomingSessions.sort((a, b) => 
      getTimeFromString(a.start) - getTimeFromString(b.start)
    );
    
    // Get the next time slot
    if (upcomingSessions.length > 0) {
      const nextStartTime = getTimeFromString(upcomingSessions[0].start);
      return upcomingSessions.filter(session => {
        const startTime = getTimeFromString(session.start);
        return startTime <= (nextStartTime + 30);
      });
    }
    
    return [];
  };
  
  // Group sessions by room
  const groupSessionsByRoom = (sessions: Array<Session & { room: string }>) => {
    const grouped: {[key: string]: Array<Session & { room: string }>} = {};
    
    sessions.forEach(session => {
      if (!grouped[session.room]) {
        grouped[session.room] = [];
      }
      grouped[session.room].push(session);
    });
    
    return grouped;
  };
  
  // Update next sessions every minute
  useEffect(() => {
    const updateSessions = () => {
      const upcoming = findUpcomingSessions();
      setNextSessions(upcoming);
      setSessionsByRoom(groupSessionsByRoom(upcoming));
    };
    
    updateSessions();
    const intervalId = setInterval(updateSessions, 60000);
    
    return () => clearInterval(intervalId);
  }, [day, currentTime]);
  
  // Sort rooms by number of sessions
  const sortedRooms = Object.keys(sessionsByRoom).sort((a, b) => 
    sessionsByRoom[b].length - sessionsByRoom[a].length
  );
  
  return { nextSessions, sessionsByRoom, sortedRooms };
}