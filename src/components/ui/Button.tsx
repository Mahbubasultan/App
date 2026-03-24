import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children, 
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl btn-transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary shadow-soft',
    success: 'bg-secondary hover:bg-secondary-light text-white focus:ring-secondary shadow-soft',
    danger: 'bg-danger hover:bg-red-700 text-white focus:ring-danger shadow-soft',
    secondary: 'bg-background-gray hover:bg-gray-200 text-text-black focus:ring-gray-400',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
      ) : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
