import React from 'react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface TagProps {
  name: string;
  color?: string | null;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Tag({
  name,
  color,
  onClick,
  onRemove,
  variant = 'default',
  size = 'md',
}: TagProps) {
  const baseStyles = 'inline-flex items-center gap-1 rounded-full font-medium transition-colors';
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const variantStyles = {
    default: color
      ? 'text-white'
      : 'bg-accent-primary/20 text-accent-primary',
    outline: 'bg-transparent text-text-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
  };

  const style = color ? { backgroundColor: color } : undefined;
  const hasBorder = variant !== 'ghost';
  
  // Determine border color based on variant
  const borderColor = variant === 'outline' 
    ? 'hsl(var(--background-border))' 
    : variant === 'default' && !color
      ? 'hsl(var(--accent-primary) / 0.3)'
      : 'transparent';

  const content = (
    <>
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/15 dark:hover:bg-white/15 rounded-full p-0.5 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
          aria-label={`Remove ${name} tag`}
        >
          <span className="text-xs leading-none">×</span>
        </button>
      )}
    </>
  );

  if (hasBorder) {
    return (
      <HandDrawnBox
        borderRadius={9999} // rounded-full equivalent
        strokeWidth={1}
        color={borderColor}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          onClick && 'cursor-pointer hover:opacity-90 hover:scale-[1.05] active:scale-[0.95]',
          onRemove && 'pr-1',
          onClick && 'transition-all duration-200 ease-in-out'
        )}
        style={style}
        onClick={onClick}
      >
        {content}
      </HandDrawnBox>
    );
  }

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        onClick && 'cursor-pointer hover:opacity-90 hover:scale-[1.05] active:scale-[0.95]',
        onRemove && 'pr-1',
        onClick && 'transition-all duration-200 ease-in-out'
      )}
      style={style}
      onClick={onClick}
    >
      {content}
    </span>
  );
}

