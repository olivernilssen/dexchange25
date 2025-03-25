"use client";

import { useEffect } from 'react';

export default function ScrollManager() {
  // Save scroll position before the page unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Restore scroll position when the page loads
  useEffect(() => {
    const savedPosition = localStorage.getItem('scrollPosition');
    if (savedPosition) {
      // Small timeout to ensure the page has fully rendered before scrolling
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
      }, 0);
    }
  }, []);

  // This component doesn't render anything
  return null;
}