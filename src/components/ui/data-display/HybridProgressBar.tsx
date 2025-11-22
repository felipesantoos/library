import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Stack } from '@/components/ui/layout';
import { BookOpen, Headphones } from 'lucide-react';

interface HybridProgressBarProps {
  currentPageText: number;
  totalPages?: number | null;
  currentMinutesAudio: number;
  totalMinutes?: number | null;
  showBreakdown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  actionSlot?: React.ReactNode;
}

export function HybridProgressBar({
  currentPageText,
  totalPages,
  currentMinutesAudio,
  totalMinutes,
  showBreakdown = true,
  size = 'md',
  className,
  actionSlot,
}: HybridProgressBarProps) {
  // Calculate individual progress percentages
  const textProgress = totalPages && totalPages > 0
    ? (currentPageText / totalPages) * 100
    : 0;

  const audioProgress = totalMinutes && totalMinutes > 0
    ? (currentMinutesAudio / totalMinutes) * 100
    : 0;

  // Calculate combined progress (50% text + 50% audio)
  const combinedProgress = (textProgress * 0.5) + (audioProgress * 0.5);

  const hasText = totalPages && totalPages > 0;
  const hasAudio = totalMinutes && totalMinutes > 0;

  if (!hasText && !hasAudio) {
    return null;
  }

  // If only one format, show simple progress bar
  if (hasText && !hasAudio) {
    return (
      <div className={className}>
        <ProgressBar
          value={textProgress}
          size={size}
          showPercentage={size !== 'sm'}
        />
        <div className="flex items-center justify-between text-sm text-text-secondary mt-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Page {currentPageText} of {totalPages}</span>
            </span>
            {actionSlot}
          </div>
          <span>{Math.round(textProgress)}%</span>
        </div>
      </div>
    );
  }

  if (hasAudio && !hasText) {
    return (
      <div className={className}>
        <ProgressBar
          value={audioProgress}
          size={size}
          showPercentage={size !== 'sm'}
        />
        <div className="flex items-center justify-between text-sm text-text-secondary mt-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Headphones className="w-3 h-3" />
              <span>{currentMinutesAudio} / {totalMinutes} minutes</span>
            </span>
            {actionSlot}
          </div>
          <span>{Math.round(audioProgress)}%</span>
        </div>
      </div>
    );
  }

  // Both formats - show hybrid progress
  return (
    <div className={className}>
      <Stack spacing="sm">
        {/* Combined Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Overall Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">{Math.round(combinedProgress)}%</span>
              {actionSlot}
            </div>
          </div>
          <ProgressBar
            value={combinedProgress}
            size={size}
            showPercentage={false}
          />
        </div>

        {/* Breakdown */}
        {showBreakdown && (
          <div className="space-y-2">
            {/* Text Progress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Text</span>
                </span>
                <span className="text-xs text-text-secondary">
                  {Math.round(textProgress)}% • {currentPageText} / {totalPages} pages
                </span>
              </div>
              <div className="relative h-2 bg-background-surface rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-accent-primary transition-all duration-300"
                  style={{ width: `${Math.min(textProgress, 100)}%` }}
                />
              </div>
            </div>

            {/* Audio Progress */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary flex items-center gap-1">
                  <Headphones className="w-3 h-3" />
                  <span>Audio</span>
                </span>
                <span className="text-xs text-text-secondary">
                  {Math.round(audioProgress)}% • {currentMinutesAudio} / {totalMinutes} minutes
                </span>
              </div>
              <div className="relative h-2 bg-background-surface rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-accent-secondary transition-all duration-300"
                  style={{ width: `${Math.min(audioProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between text-xs text-text-secondary pt-1 border-t border-background-border">
          <span>
            {Math.round(textProgress)}% text + {Math.round(audioProgress)}% audio
          </span>
          <span>
            = {Math.round(combinedProgress)}% overall
          </span>
        </div>
      </Stack>
    </div>
  );
}

