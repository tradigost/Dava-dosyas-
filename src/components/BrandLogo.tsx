/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'mark';
  className?: string;
}

/**
 * Renders the forensic magnifying-glass & fingerprint brand emblem (`full` lockup or `mark` icon).
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className,
}) => {
  const uid = React.useId().replace(/:/g, '');
  const clipId = `lens-clip-${uid}`;
  const titleId = `logo-title-${uid}`;

  if (variant === 'mark') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="28 26 128 128"
        role="img"
        aria-label="Suç Dosyası: Dedektiflik Oyunu"
        className={className || 'w-14 h-14'}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="80" cy="78" r="42" />
          </clipPath>
        </defs>
        <circle cx="80" cy="78" r="42" fill="#faf6ed" />
        <g clipPath={`url(#${clipId})`}>
          <g
            transform="translate(42, 40) scale(3.16)"
            fill="none"
            stroke="#8b1e1e"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" />
            <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" />
            <path d="M12 11v2a14 14 0 0 0 2.5 8" />
            <path d="M8 15a18 18 0 0 0 1.8 6" />
            <path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" />
          </g>
          <line x1="80" y1="32" x2="80" y2="44" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="80" y1="112" x2="80" y2="124" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="34" y1="78" x2="46" y2="78" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="114" y1="78" x2="126" y2="78" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
        </g>
        <circle cx="80" cy="78" r="44" fill="none" stroke="#1f1c18" strokeWidth="5.5" />
        <circle cx="80" cy="78" r="38" fill="none" stroke="#d6cdbc" strokeWidth="1.2" />
        <line x1="112" y1="110" x2="144" y2="142" stroke="#1f1c18" strokeWidth="9" strokeLinecap="round" />
        <line x1="112" y1="110" x2="144" y2="142" stroke="#575046" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 560 180"
      role="img"
      aria-labelledby={titleId}
      className={className || 'w-full max-w-[400px] h-auto'}
    >
      <title id={titleId}>Suç Dosyası: Dedektiflik Oyunu</title>
      <defs>
        <clipPath id={clipId}>
          <circle cx="80" cy="78" r="42" />
        </clipPath>
      </defs>

      <g transform="translate(8, 6)">
        <circle cx="80" cy="78" r="42" fill="#faf6ed" />
        <g clipPath={`url(#${clipId})`}>
          <g
            transform="translate(42, 40) scale(3.16)"
            fill="none"
            stroke="#8b1e1e"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.9 7a8 8 0 0 1 1.1 5v1a6 6 0 0 0 .8 3" />
            <path d="M8 11a4 4 0 0 1 8 0v1a10 10 0 0 0 2 6" />
            <path d="M12 11v2a14 14 0 0 0 2.5 8" />
            <path d="M8 15a18 18 0 0 0 1.8 6" />
            <path d="M4.9 19a22 22 0 0 1 -.9 -7v-1a8 8 0 0 1 12 -6.95" />
          </g>
          <line x1="80" y1="32" x2="80" y2="44" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="80" y1="112" x2="80" y2="124" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="34" y1="78" x2="46" y2="78" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
          <line x1="114" y1="78" x2="126" y2="78" stroke="#1f1c18" strokeWidth="1.2" opacity="0.45" />
        </g>
        <circle cx="80" cy="78" r="44" fill="none" stroke="#1f1c18" strokeWidth="5.5" />
        <circle cx="80" cy="78" r="38" fill="none" stroke="#d6cdbc" strokeWidth="1.2" />
        <line x1="112" y1="110" x2="144" y2="142" stroke="#1f1c18" strokeWidth="9" strokeLinecap="round" />
        <line x1="112" y1="110" x2="144" y2="142" stroke="#575046" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      <g transform="translate(174, 42)">
        <text
          x="2"
          y="10"
          fontFamily="'JetBrains Mono', 'Courier Prime', 'Courier New', monospace"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="3.5"
          fill="#8b1e1e"
        >
          KRİMİNAL BÜRO // DELİL #04
        </text>
        <text
          x="0"
          y="56"
          fontFamily="'JetBrains Mono', 'Courier Prime', 'Courier New', monospace"
          fontSize="39"
          fontWeight="800"
          letterSpacing="4"
          fill="#1f1c18"
        >
          SUÇ DOSYASI
        </text>
        <rect x="2" y="70" width="346" height="2" fill="#1f1c18" />
        <rect x="2" y="70" width="96" height="2" fill="#8b1e1e" />
        <text
          x="2"
          y="96"
          fontFamily="'JetBrains Mono', 'Courier Prime', 'Courier New', monospace"
          fontSize="15"
          fontWeight="600"
          letterSpacing="5.2"
          fill="#575046"
        >
          DEDEKTİFLİK OYUNU
        </text>
      </g>
    </svg>
  );
};
