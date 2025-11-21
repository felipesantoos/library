import React from 'react';
import { HandDrawnBox } from './HandDrawnBox';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showBorder?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showBorder = true,
  ...props
}: ButtonProps) {
  const baseStyles = 'flex items-center justify-center transition-all duration-200 ease-in-out font-medium';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: 'bg-accent-primary text-background-surface dark:text-dark-text-primary hover:bg-accent-primary/90 text-accent-primary',
    secondary: 'bg-accent-secondary text-text-primary dark:text-dark-text-primary hover:bg-accent-secondary/90 text-accent-secondary',
    outline: 'bg-transparent border-0 text-text-primary dark:text-dark-text-primary hover:bg-background-surface dark:hover:bg-dark-background-surface text-background-border dark:text-dark-background-border',
    ghost: 'bg-transparent border-0 text-text-secondary dark:text-dark-text-secondary hover:bg-accent-primary/15 hover:text-accent-primary dark:hover:text-dark-accent-primary',
  };

  // Determine border color based on variant
  // For outline, we want the theme border color
  // For ghost, transparent (no border)
  // For primary/secondary, currentColor matches the text
  const borderColor = variant === 'outline' 
    ? undefined // HandDrawnBox will use currentColor, which should be set via CSS
    : variant === 'ghost'
      ? 'transparent'
      : undefined; // Use currentColor for primary/secondary too

  const buttonElement = (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        'hover:scale-[1.02] active:scale-[0.98]',
        !showBorder && 'rounded-md',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );

  if (!showBorder) {
    return buttonElement;
  }

  return (
    <HandDrawnBox
      borderRadius={6}
      strokeWidth={1}
      color={borderColor}
      className={cn(
        'inline-block',
        fullWidth && 'w-full'
      )}
    >
      {buttonElement}
    </HandDrawnBox>
  );
}

