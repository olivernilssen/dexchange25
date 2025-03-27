import { Session } from '../../types/schedule';
import { formatTime, getTagColor } from '../../utils/timeUtils';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';
import { ExternalLink, PlayCircle, Video } from 'lucide-react';
import { useEffect, useRef } from 'react';
import RoomBadge from './RoomBadge';

interface SessionModalProps {
  session: Session & { room?: string } | null;
  connectedSessions?: Session[];
  onClose: () => void;
  dayIndex?: number;
}

export default function SessionModal({ session, connectedSessions, onClose, dayIndex = 0 }: SessionModalProps) {
  // Store the scroll position
  const scrollPositionRef = useRef(0);
  const isCommon = session?.room === 'Felles';
  
  // Effect to manage body scroll locking
  useEffect(() => {
    if (session) {
      // Store current scroll position before locking
      scrollPositionRef.current = window.scrollY;
      
      // Add the no-scroll class to the body
      document.body.classList.add('modal-open');
      
      // Set the body position to fixed to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Remove the no-scroll class from the body
      document.body.classList.remove('modal-open');
      
      // Restore the scroll position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      if (session) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, [session]);
  
  if (!session) return null;
  
  const isWorkshop = session.kind === 'workshop';
  const accentColor = isWorkshop 
    ? 'border-workshop-main text-workshop-text' 
    : 'border-speech-main text-speech-text';
    
  const timeTextColor = isWorkshop 
    ? 'text-workshop-text' 
    : 'text-speech-text';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
      <div 
        className="bg-neutral-card w-full max-w-xl sm:rounded-lg rounded-none max-h-[100vh] sm:max-h-[85vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-4 border-b border-neutral-border relative ${accentColor}`}>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-neutral-text-secondary hover:text-neutral-text-primary"
            aria-label="Lukk"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="pr-8">
            <h2 className="text-xl font-bold text-neutral-text-primary">{session.title}</h2>
            
            <div className="flex items-center justify-between mt-2">
              <div className={`text-sm font-medium ${timeTextColor}`}>
                {formatTime(session.start)} - {formatTime(session.end)}
              </div>
              
              {session.room && (
                <RoomBadge 
                  room={session.room}
                  isCommon={isCommon}
                  dayIndex={dayIndex}
                />
              )}
            </div>
            
            {session.speaker && (
              <div className="text-neutral-text-primary mt-2">{session.speaker}</div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-1 mt-3">
            {session.kind && (
              <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-medium ${
                isWorkshop ? 'bg-workshop-main text-primary-contrast' : 'bg-speech-main text-primary-contrast'
              }`}>
                {isWorkshop ? 'workshop' : 'foredrag'}
              </span>
            )}
            
            {session.tag && session.tag.split(',').map((tag, index) => (
              <span 
                key={index} 
                className={`${getTagColor(tag.trim())} px-2 py-0.5 text-xs rounded`}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
          
          {/* Teams meeting and recording links */}
          {(session.teams || session.recording) && (
            <div className="mt-4 space-y-2">
              {session.teams && (
                <a 
                  href={session.teams} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm px-3 py-2 bg-teams-main text-primary-contrast rounded-md hover:bg-teams-dark transition-colors"
                >
                  <Video size={16} />
                  Join Teams Meeting
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              )}
              
              {session.recording && (
                <a 
                  href={session.recording} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm px-3 py-2 bg-recording-main text-primary-contrast rounded-md hover:bg-recording-dark transition-colors"
                >
                  <PlayCircle size={16} />
                  Watch Recording
                  <ExternalLink size={14} className="ml-auto" />
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 overflow-auto flex-1">
          {session.ingress && (
            <div className="text-neutral-text-primary font-medium mb-4">{session.ingress}</div>
          )}
          
          {session.description && (
            <div className="text-neutral-text-primary whitespace-pre-line">{session.description}</div>
          )}
          
          {/* Connected sessions section */}
          {connectedSessions && connectedSessions.length > 1 && (
            <div className="mt-6 border-t border-neutral-border pt-4">
              <h3 className="font-bold text-neutral-text-primary mb-2">Tilknyttede aktiviteter:</h3>
              <div className="space-y-2">
                {connectedSessions.map((connectedSession, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded border-l-4 ${
                      (connectedSession.title === session.title && connectedSession.start === session.start)
                        ? 'bg-neutral-background border-speech-main' 
                        : 'bg-neutral-card border-neutral-border hover:bg-neutral-background cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!(connectedSession.title === session.title && connectedSession.start === session.start)) {
                        onClose();
                        // After a short delay, open the new session modal
                        setTimeout(() => {
                          const event = new CustomEvent('openSession', { 
                            detail: { session: connectedSession, connectedSessions }
                          });
                          window.dispatchEvent(event);
                        }, 100);
                      }
                    }}
                  >
                    <div className="font-medium text-neutral-text-primary">{connectedSession.title}</div>
                    <div className="text-sm text-neutral-text-secondary">
                      {formatTime(connectedSession.start)} - {formatTime(connectedSession.end)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-neutral-border bg-neutral-background flex justify-between items-center">
          <FavoriteButton 
            session={session} 
            dayIndex={dayIndex} 
            className="text-neutral-text-secondary"
          />
          
          <button
            onClick={onClose}
            className="bg-primary-main text-primary-contrast font-medium py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}