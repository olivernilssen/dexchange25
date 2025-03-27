interface SessionTypeBadgeProps {
  type: string;
  className?: string;
}

export default function SessionTypeBadge({ type, className = '' }: SessionTypeBadgeProps) {
  const isWorkshop = type === 'workshop';
  
  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs rounded font-medium ${
      isWorkshop 
        ? 'bg-workshop-main text-neutral-text-white' 
        : 'bg-primary-light text-neutral-text-white'
    } ${className}`}>
      {isWorkshop ? 'workshop' : 'foredrag'}
    </span>
  );
}