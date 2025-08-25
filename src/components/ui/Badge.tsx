// components/ui/Badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'available' | 'unavailable' | 'pending' | 'active' | 'success' | 'warning' | 'danger';
  icon?: React.ComponentType<{ className?: string }>;
  pulse?: boolean;
  className?: string;
}

export function Badge({ 
  children, 
  variant = 'active', 
  icon: Icon,
  pulse = false,
  className = ''
}: BadgeProps) {
  const baseClass = 'badge-base';
  const variantClass = `badge-${variant}`;
  const pulseClass = pulse ? 'pulse-slow' : '';
  
  const classes = [baseClass, variantClass, pulseClass, className]
    .filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}