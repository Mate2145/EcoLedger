import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

export default function Logo({ size = 'md', withText = true }: LogoProps) {
  const sizes = {
    sm: { logo: 24, text: 'text-lg' },
    md: { logo: 32, text: 'text-xl' },
    lg: { logo: 40, text: 'text-2xl' },
  };

  return (
    <Link href="/dashboard" className="flex items-center">
      <div className="flex items-center">
        <div
          className={`bg-green-600 rounded-sm text-white flex items-center justify-center`}
          style={{ width: sizes[size].logo, height: sizes[size].logo }}
        >
          <span className={`font-bold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>E</span>
        </div>
        
        {withText && (
          <span className={`text-green-600 font-bold ${sizes[size].text} ml-2`}>
            EcoLedger
          </span>
        )}
      </div>
    </Link>
  );
} 