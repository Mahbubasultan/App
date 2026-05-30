'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
  showLabel?: boolean;
  isDark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  href = '/',
  className = '',
  showLabel = true,
  isDark = false,
}) => {
  const sizeMap = {
    xs: { icon: 32, full: 40, label: 'text-xs' },
    sm: { icon: 40, full: 52, label: 'text-sm' },
    md: { icon: 48, full: 60, label: 'text-base' },
    lg: { icon: 60, full: 72, label: 'text-lg' },
    xl: { icon: 72, full: 88, label: 'text-xl' },
  };

  const dimensions = sizeMap[size];
  const iconSize = variant === 'icon' ? dimensions.icon : dimensions.full;

  const LogoContent = () => (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0"
        style={{ width: iconSize, height: iconSize }}
      >
        <Image
          src="/images/trust-nest-logo.png"
          alt="Trust Nest Logo"
          width={iconSize}
          height={iconSize}
          priority={size === 'lg' || size === 'xl'}
          className="h-full w-full object-contain"
        />
      </div>
      
      {variant === 'full' && showLabel && (
        <div className="hidden sm:block">
          <h1 className={`font-bold ${dimensions.label} ${isDark ? 'text-white' : 'text-[#0B5D3B]'}`}>
            Trust Nest
          </h1>
          <p className={`text-xs hidden md:block ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
            Community Savings Platform
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
