import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default' | 'active' | 'pending' | 'completed' | 'error';
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
    success: 'bg-primary-50 text-primary-700 border-primary-200',
    active: 'bg-primary-50 text-primary-700 border-primary-200',
    pending: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
    error: 'bg-danger-50 text-danger-700 border-danger-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    info: 'bg-info-50 text-info-700 border-info-200',
    completed: 'bg-primary-50 text-primary-700 border-primary-200',
    default: 'bg-gray-100 text-text-secondary border-gray-200',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
