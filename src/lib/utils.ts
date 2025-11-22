import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps book status strings to formatted display names
 */
const STATUS_FORMAT_MAP: Record<string, string> = {
  not_started: 'Not Started',
  reading: 'Reading',
  paused: 'Paused',
  abandoned: 'Abandoned',
  completed: 'Completed',
  rereading: 'Rereading',
};

/**
 * Formats a book status string for display
 * @param status - The raw status string (e.g., "not_started", "reading")
 * @returns Formatted status string (e.g., "Não Iniciado", "Lendo")
 */
export function formatBookStatus(status: string): string {
  return STATUS_FORMAT_MAP[status] || status.replace(/_/g, ' ');
}

