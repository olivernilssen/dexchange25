import { formatTime, getTagColor } from '../../utils/timeUtils';
import { Session } from '../../types/schedule';
import { useEffect, useRef } from 'react';

interface SessionModalProps {
  session: Session & { room?: string } | null;
  onClose: () => void;
}

export default function SessionModal({ session, onClose }: SessionModalProps) {
  // Store the scroll position
  const scrollPositionRef = useRef(0);
  
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
  const sessionTypeIcon = isWorkshop ? '🔧' : '🎤';
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto ${
          isWorkshop ? 'border-t-8 border-[#e05252]' : 'border-t-8 border-[#3949ab]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Add a colored header bar */}
        <div className={`p-4 ${
          isWorkshop ? 'bg-[#fff0f0]' : 'bg-[#f0f4ff]'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-sm font-medium ${
                isWorkshop ? 'text-[#b73939]' : 'text-[#3949ab]'
              }`}>
                {formatTime(session.start)} - {formatTime(session.end)}
              </span>
              {session.room && (
                <span className="ml-2 text-sm font-medium text-[#555555]">
                  • {session.room}
                </span>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Session type banner with Norwegian text for speech */}
          <div className={`mt-2 py-1 px-3 inline-block rounded-full text-sm font-medium ${
            isWorkshop 
              ? 'bg-[#e05252] text-white' 
              : 'bg-[#3949ab] text-white'
          }`}>
            {sessionTypeIcon} {isWorkshop ? 'workshop' : 'foredrag'}
          </div>
          
          <h2 className="text-2xl font-bold text-[#333333] mt-2">{session.title}</h2>
          
          {/* Speaker name - displayed prominently without label */}
          {session.speaker && (
            <div className="mt-2 text-lg text-[#555555]">{session.speaker}</div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {session.tag && session.tag.split(',').map((tag, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getTagColor(tag)}`}>
                {tag.trim()}
              </span>
            ))}
          </div>
          
          {isWorkshop && (
            <div className="mb-4 p-3 bg-[#fff0f0] border border-[#e05252] rounded-md">
              <h3 className="text-sm font-bold text-[#e05252] flex items-center">
                <span className="mr-2">👥</span> Interaktiv Økt
              </h3>
              <p className="text-[#b73939] text-sm">
                Dette er en praktisk workshop-økt. Kom forberedt til å delta!
              </p>
            </div>
          )}
          
          {session.ingress && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500">Ingress</h3>
              <p className="text-[#333333] italic">{session.ingress}</p>
            </div>
          )}
          
          {session.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Beskrivelse</h3>
              <div className="text-[#333333]">
                {session.description.split('\n').map((paragraph, i) => (
                  <p key={i} className="mt-2">{paragraph.trim()}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}