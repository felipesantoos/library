import { useState, useEffect, useRef } from 'react';

interface UseSessionTimerResult {
  seconds: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export function useSessionTimer(
  onStart?: () => void,
  onStop?: (seconds: number) => void
): UseSessionTimerResult {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    onStart?.();
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    onStop?.(seconds);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return {
    seconds,
    isRunning,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}

