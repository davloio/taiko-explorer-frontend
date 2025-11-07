'use client';

import React from 'react';

interface TaikoLinesProps {
  type?: 'vertical' | 'radial';
  className?: string;
}

export function TaikoLines({ type = 'vertical', className = '' }: TaikoLinesProps) {
  if (type === 'radial') {
    return (
      <div className={`taiko-radial-lines ${className}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="taiko-radial-line" />
        ))}
      </div>
    );
  }

  return (
    <div className={`taiko-lines-container ${className}`}>
      {Array.from({ length: 8 }).map((_, i) => {
        const lineNumber = i < 4 ? i + 1 : i + 2; // Skip line 5 (middle)
        return (
          <div key={i} className={`taiko-line taiko-line-${lineNumber}`} />
        );
      })}
    </div>
  );
}

interface TaikoBackgroundProps {
  children: React.ReactNode;
  showLines?: boolean;
  showRadial?: boolean;
  className?: string;
}

export function TaikoBackground({ 
  children, 
  showLines = true, 
  showRadial = false, 
  className = '' 
}: TaikoBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showLines && <TaikoLines type="vertical" />}
      {showRadial && <TaikoLines type="radial" />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}