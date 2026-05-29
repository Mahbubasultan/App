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
    xs: { icon: 24, full: 32, label: 'text-xs' },
    sm: { icon: 28, full: 36, label: 'text-sm' },
    md: { icon: 32, full: 40, label: 'text-base' },
    lg: { icon: 40, full: 48, label: 'text-lg' },
    xl: { icon: 48, full: 56, label: 'text-xl' },
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
          src="/images/logo-mark-transparent.png"
          alt="TrustNest Logo"
          width={375}
          height={400}
          priority={size === 'lg' || size === 'xl'}
          className="h-full w-full object-contain"
        />
      </div>
      
      {variant === 'full' && showLabel && (
        <div className="hidden sm:block">
          <h1 className={`font-bold ${dimensions.label} ${isDark ? 'text-white' : 'text-[#0B5D3B]'}`}>
            TrustNest
          </h1>
          <p className={`text-xs hidden md:block ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
            Trusted Today, Secured Tomorrow
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
