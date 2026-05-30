'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface BrandProps {
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  className?: string;
}

export const Brand: React.FC<BrandProps> = ({
  layout = 'horizontal',
  size = 'md',
  href,
  theme = 'light',
  showTagline = true,
  className = '',
}) => {
  // Logo size configurations
  const logoSizes = {
    sm: 44,   // sidebar
    md: 48,   // navbar
    lg: 96,   // auth pages
  };

  // Text size configurations
  const textSizes = {
    sm: { name: 'text-xl',   tagline: 'text-xs' },
    md: { name: 'text-2xl',  tagline: 'text-sm' },
    lg: { name: 'text-4xl',  tagline: 'text-base' },
  };

  const logoSize = logoSizes[size];
  const textSize = textSizes[size];

  // Theme colors
  const colors = {
    light: {
      name: 'text-gray-900',
      accent: 'text-green-600',
      tagline: 'text-gray-600',
    },
    dark: {
      name: 'text-white',
      accent: 'text-green-300',
      tagline: 'text-white/70',
    },
  };

  const themeColors = colors[theme];

  const BrandContent = () => (
    <div
      className={`flex ${
        layout === 'vertical'
          ? 'flex-col items-center text-center'
          : 'flex-row items-center'
      } gap-2.5 ${className}`}
    >
      {/* Logo */}
      <div
        className="relative flex-shrink-0"
        style={{ width: logoSize, height: logoSize }}
      >
        <Image
          src="/images/trust-nest-logo.png"
          alt="Trust Nest Logo"
          width={logoSize}
          height={logoSize}
          priority
          className="h-full w-full object-contain"
        />
      </div>

      {/* Brand Name & Tagline */}
      <div className={layout === 'vertical' ? 'text-center' : ''}>
        <h1 className={`font-bold ${textSize.name} leading-tight tracking-tight`}>
          <span className="text-black">Trust</span>
          <span className="text-[#16A34A]">Nest</span>
        </h1>
        {showTagline && (
          <p className={`${textSize.tagline} ${themeColors.tagline} mt-0.5`}>
            Community Savings Platform
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        <BrandContent />
      </Link>
    );
  }

  return <BrandContent />;
};

export default Brand;
