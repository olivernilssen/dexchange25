import { getTagColor } from '../../utils/timeUtils';

interface SessionTagsProps {
  tags: string;
  className?: string;
}

export default function SessionTags({ tags, className = '' }: SessionTagsProps) {
  if (!tags) return null;
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.split(',').map((tag: string, i: number) => (
        <span key={i} className={`inline-flex px-2 py-0.5 text-xs rounded-md text-neutral-black ${getTagColor(tag.trim())}`}>
          {tag.trim()}
        </span>
      ))}
    </div>
  );
}