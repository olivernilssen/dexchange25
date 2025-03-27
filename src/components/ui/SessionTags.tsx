import React from 'react';
import { getTagColor } from '../../utils/timeUtils';

interface SessionTagsProps {
  tags: string;
  className?: string;
}

export default function SessionTags({ tags, className = '' }: SessionTagsProps) {
  if (!tags) return null;
  
  // Split by commas and filter out empty tags
  const tagList = tags.split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  
  if (tagList.length === 0) return null;
  
  return (
    <>
      {tagList.map((tag, index) => (
        <span 
          key={index}
          className={`inline-flex items-center font-medium px-2 py-0.5 text-xs rounded bg-[${getTagColor(tag.trim())}] text-gray-800 ${className}`}
        >
          {tag}
        </span>
      ))}
    </>
  );
}