import React from 'react';
import { Lightbulb, HelpCircle, Brain, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type Sentiment = 'inspiration' | 'doubt' | 'reflection' | 'learning';

interface SentimentBadgeProps {
  sentiment: Sentiment;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const sentimentConfig: Record<Sentiment, { label: string; icon: React.ElementType; color: string }> = {
  inspiration: {
    label: 'Inspiration',
    icon: Lightbulb,
    color: 'text-accent-secondary border-accent-secondary bg-accent-secondary/10',
  },
  doubt: {
    label: 'Doubt',
    icon: HelpCircle,
    color: 'text-semantic-warning border-semantic-warning bg-semantic-warning/10',
  },
  reflection: {
    label: 'Reflection',
    icon: Brain,
    color: 'text-accent-primary border-accent-primary bg-accent-primary/10',
  },
  learning: {
    label: 'Learning',
    icon: BookOpen,
    color: 'text-semantic-success border-semantic-success bg-semantic-success/10',
  },
};

export function SentimentBadge({ sentiment, size = 'sm', variant = 'default' }: SentimentBadgeProps) {
  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const variantStyles = {
    default: `border ${config.color}`,
    outline: `border bg-transparent ${config.color}`,
    ghost: 'border-transparent bg-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-medium transition-colors',
        sizeStyles[size],
        variantStyles[variant]
      )}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </span>
  );
}

