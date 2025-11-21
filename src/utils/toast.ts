import { toast as sonnerToast } from 'sonner';

/**
 * Helper functions for displaying toast notifications
 * Provides user-friendly error, success, and info messages
 */
export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 3000,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 3000,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Display a user-friendly error message based on the error type
   */
  handleError: (err: unknown, defaultMessage: string = 'An error occurred') => {
    let message = defaultMessage;
    let description: string | undefined;

    if (err instanceof Error) {
      message = err.message || defaultMessage;
      
      // Provide more context for common error types
      if (message.includes('database') || message.includes('connection')) {
        description = 'Please check your database connection and try again.';
      } else if (message.includes('not found')) {
        description = 'The requested item could not be found.';
      } else if (message.includes('validation') || message.includes('invalid')) {
        description = 'Please check your input and try again.';
      }
    }

    toast.error(message, description);
  },
};

