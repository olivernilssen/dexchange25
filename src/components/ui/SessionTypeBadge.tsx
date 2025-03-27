import React from 'react';

interface SessionTypeBadgeProps {
  type: string;
  className?: string;
}

export default function SessionTypeBadge({ type, className = '' }: SessionTypeBadgeProps) {
  const getBadgeClasses = () => {
    switch (type.toLowerCase()) {
      case 'workshop':
        return 'bg-workshop-main text-white';
      case 'speech':
        return 'bg-speech-main text-white';
      case 'foredrag':
        return 'bg-speech-main text-white';
      case 'common':
        return 'bg-common-main text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const displayText = type.toLowerCase() === 'workshop' ? 'Workshop' : 'Foredrag' ;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded font-medium ${getBadgeClasses()} ${className}`}>
      {displayText}
    </span>
  );
}