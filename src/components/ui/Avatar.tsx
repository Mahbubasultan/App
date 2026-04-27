import React from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name = 'User',
  size = 'md',
  className = '' 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-32 h-32 text-3xl',
  };

  if (src) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden shadow-soft ${className}`}>
        <Image 
          src={src} 
          alt={name} 
          width={size === 'xl' ? 128 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          height={size === 'xl' ? 128 : size === 'lg' ? 64 : size === 'md' ? 40 : 32}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold shadow-soft ${className}`}>
      {name ? getInitials(name) : <User size={size === 'xl' ? 48 : size === 'lg' ? 24 : 16} />}
    </div>
  );
};
