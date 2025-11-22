import React from 'react';
import { HandDrawnBox } from './HandDrawnBox';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  showBorder?: boolean;
  linearCorners?: boolean;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  iconOnly?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showBorder = true,
  linearCorners = true,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all duration-200 ease-in-out font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
  
  const sizeStyles = {
    sm: iconOnly ? 'p-1.5' : 'px-3 py-1.5 text-sm',
    md: iconOnly ? 'p-2' : 'px-4 py-2 text-base',
    lg: iconOnly ? 'p-3' : 'px-6 py-3 text-lg',
  };

  const iconSizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getVariantStyles = (showBorder: boolean) => ({
    primary: 'bg-accent-primary text-background-surface dark:text-dark-text-primary hover:bg-accent-primary/90 text-accent-primary',
    secondary: 'bg-accent-secondary text-text-primary dark:text-dark-text-primary hover:bg-accent-secondary/90 text-accent-secondary',
    outline: showBorder 
      ? 'bg-transparent border-0 text-text-primary dark:text-dark-text-primary hover:bg-background-surface dark:hover:bg-dark-background-surface'
      : 'bg-transparent border border-background-border dark:border-dark-background-border text-text-primary dark:text-dark-text-primary hover:bg-background-surface dark:hover:bg-dark-background-surface hover:border-accent-primary/50',
    ghost: 'bg-transparent border-0 text-text-secondary dark:text-dark-text-secondary hover:bg-accent-primary/15 hover:text-accent-primary dark:hover:text-dark-accent-primary',
  });

  // Determine border color based on variant
  // For outline, we want the theme border color
  // For ghost, transparent (no border)
  // For primary/secondary, currentColor matches the text
  const borderColor = variant === 'outline' 
    ? undefined // HandDrawnBox will use currentColor, which should be set via CSS
    : variant === 'ghost'
      ? 'transparent'
      : undefined; // Use currentColor for primary/secondary too

  // Generate torn paper edge clip-path for outline variant
  const getTornEdgeClipPath = () => {
    if (variant !== 'outline' || showBorder) return undefined;
    
    // Create irregular torn edge pattern for left and right sides
    // Left edge: alternating between 0 and 6-8px to create torn effect
    // Right edge: alternating between 100% and calc(100% - 6-8px)
    return `polygon(
      7px 0%, 0% 6%, 8px 12%, 0% 20%, 6px 28%, 0% 36%, 7px 44%, 0% 52%, 8px 60%, 0% 68%, 6px 76%, 0% 84%, 7px 92%, 0% 100%,
      calc(100% - 7px) 100%, 100% 94%, calc(100% - 8px) 88%, 100% 80%, calc(100% - 6px) 72%, 100% 64%, calc(100% - 7px) 56%, 100% 48%, calc(100% - 8px) 40%, 100% 32%, calc(100% - 6px) 24%, 100% 16%, calc(100% - 7px) 8%, 100% 0%, calc(100% - 7px) 0%
    )`;
  };

  const variantStyles = getVariantStyles(showBorder);
  const isDisabled = disabled || loading;

  // Render icon
  const renderIcon = () => {
    if (loading) {
      return (
        <Loader2 
          className={cn(iconSizeStyles[size], 'animate-spin flex-shrink-0')} 
          aria-hidden="true" 
        />
      );
    }
    if (icon) {
      // Clone icon element to add size classes directly if it's a React element
      if (React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement<any>, {
          className: cn(iconSizeStyles[size], 'flex-shrink-0', (icon as React.ReactElement<any>).props?.className),
          'aria-hidden': 'true',
        });
      }
      return (
        <span 
          className={cn(iconSizeStyles[size], 'flex-shrink-0')} 
          aria-hidden="true"
        >
          {icon}
        </span>
      );
    }
    return null;
  };

  // Determine content order with proper alignment
  const content = iconOnly ? (
    renderIcon()
  ) : (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      {children}
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  );

  const buttonElement = (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && 'w-full',
        !isDisabled && 'hover:scale-[1.02] active:scale-[0.98]',
        !showBorder && 'rounded-md',
        variant === 'outline' && !showBorder && 'relative',
        iconOnly && 'aspect-square',
        className
      )}
      style={
        variant === 'outline' && !showBorder
          ? {
              clipPath: getTornEdgeClipPath(),
            }
          : undefined
      }
      disabled={isDisabled}
      aria-busy={loading}
      aria-disabled={isDisabled}
      {...props}
    >
      {content}
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
      linearCorners={linearCorners}
      className={cn(
        'inline-block',
        fullWidth && 'w-full'
      )}
    >
      {buttonElement}
    </HandDrawnBox>
  );
}

