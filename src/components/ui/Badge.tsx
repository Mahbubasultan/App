import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    success: 'bg-secondary/10 text-secondary border-secondary/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-primary/10 text-primary border-primary/20',
    default: 'bg-gray-100 text-text-gray border-gray-200',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
