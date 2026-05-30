'use client';

import React from 'react';

interface TrustNetLogoProps {
  size?: number;
}

export const TrustNetLogo: React.FC<TrustNetLogoProps> = ({ size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      overflow: 'hidden',
      flexShrink: 0,
      display: 'inline-block',
      position: 'relative',
    }}
  >
    <img
      src="/images/trust-nest-logo.png"
      alt="TrustNet"
      style={{
        position: 'absolute',
        width: '220%',
        height: '220%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        objectFit: 'cover',
        objectPosition: 'center center',
      }}
    />
  </div>
);

export default TrustNetLogo;
