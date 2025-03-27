interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'workshop' | 'speech' | 'common';
}

export default function Badge({ 
  children, 
  className = '', 
  variant = 'default' 
}: BadgeProps) {
  const baseClasses = "inline-flex items-center text-xs font-medium rounded px-2 py-0.5";
  
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    workshop: 'bg-workshop-main text-white',
    speech: 'bg-speech-main text-white',
    common: 'bg-common-main text-white',
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}