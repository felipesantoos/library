import { Section } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { Play, Square } from 'lucide-react';

interface SessionTimerProps {
  seconds: number;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function SessionTimer({ seconds, isRunning, onStart, onStop }: SessionTimerProps) {
  const formatTimer = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasButtons = (!isRunning && seconds === 0) || isRunning;

  return (
    <Section padding="lg" className="text-center">
        <div className={`text-4xl font-mono font-bold text-text-primary ${hasButtons ? "mb-2" : ""}`}>
          {formatTimer(seconds)}
        </div>
        {hasButtons && (
          <div className="flex items-center justify-center space-x-3">
            {!isRunning && seconds === 0 && (
              <Button
                onClick={onStart}
                variant="primary"
                icon={<Play />}
                iconPosition="left"
              >
                Start Timer
              </Button>
            )}
            {isRunning && (
              <Button
                onClick={onStop}
                variant="secondary"
                icon={<Square />}
                iconPosition="left"
                className="bg-semantic-error hover:bg-semantic-error/90"
              >
                Stop
              </Button>
            )}
          </div>
        )}
    </Section>
  );
}

