interface SessionTypeBadgeProps {
  type: string;
  className?: string;
}

export default function SessionTypeBadge({ type, className = '' }: SessionTypeBadgeProps) {
  const isWorkshop = type === 'workshop';
  
  return (
    <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
      isWorkshop 
        ? 'bg-[#e05252] text-white' 
        : 'bg-[#3949ab] text-white'
    } ${className}`}>
      {isWorkshop ? 'workshop' : 'foredrag'}
    </span>
  );
}