import React from 'react';

interface SessionCardProps {
  children: React.ReactNode;
  type: 'common' | 'workshop' | 'speech';
  className?: string;
  isCompleted?: boolean;
  onClick?: () => void;
}

export default function SessionCard({ 
  children, 
  type, 
  className = '', 
  isCompleted = false,
  onClick
}: SessionCardProps) {
  const baseClasses = "relative rounded shadow cursor-pointer transition-colors border-l-4";
  
  const typeClasses = {
    common: "border-common-main bg-common-light hover:bg-common-hover",
    workshop: "border-workshop-main bg-workshop-light hover:bg-workshop-hover",
    speech: "border-speech-main bg-speech-light hover:bg-speech-hover",
  };
  
  return (
    <div 
      className={`${baseClasses} ${typeClasses[type]} ${isCompleted ? "opacity-75" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}