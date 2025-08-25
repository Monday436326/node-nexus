// components/ui/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'accent';
  size?: 'sm' | 'base' | 'lg';
  loading?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'base', 
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  glow = false,
  className = '',
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'btn-base';
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== 'base' ? `btn-${size}` : '';
  const loadingClass = loading ? 'btn-loading' : '';
  const glowClass = glow ? 'glow' : '';
  
  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    loadingClass,
    glowClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {!loading && (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
      {loading && <span>Loading...</span>}
    </button>
  );
}