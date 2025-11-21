import React from 'react';
import { cn } from '@/lib/utils';

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
      ? 'text-white border border-transparent'
      : 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30',
    outline: 'bg-transparent border border-background-border text-text-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
  };

  const style = color ? { backgroundColor: color } : undefined;

  return (
    <span
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        onClick && 'cursor-pointer hover:opacity-80',
        onRemove && 'pr-1'
      )}
      style={style}
      onClick={onClick}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${name} tag`}
        >
          <span className="text-xs leading-none">×</span>
        </button>
      )}
    </span>
  );
}

