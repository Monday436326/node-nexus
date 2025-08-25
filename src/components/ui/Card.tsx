// components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'modern' | 'floating' | 'gradient' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

export function Card({ 
  children, 
  variant = 'modern', 
  padding = 'md',
  hover = false,
  className = ''
}: CardProps) {
  const baseClass = variant === 'modern' ? 'card-modern' : 
                   variant === 'floating' ? 'card-floating' :
                   variant === 'gradient' ? 'card-gradient' :
                   'card-dark';
  
  const paddingClass = padding === 'sm' ? 'p-4' : 
                      padding === 'lg' ? 'p-8' : 
                      'p-6';
  
  const hoverClass = hover ? 'interactive-hover' : '';
  
  const classes = [baseClass, paddingClass, hoverClass, className]
    .filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
}