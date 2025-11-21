import { useNavigate, useLocation } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useEffect } from 'react';

export function KeyboardShortcutsHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useKeyboardShortcuts([
    {
      key: 'l',
      ctrl: true,
      description: 'Open Library / Global Search',
      category: 'Navigation',
      action: () => {
        if (location.pathname !== '/library') {
          navigate('/library');
        }
      },
    },
    {
      key: 'n',
      ctrl: true,
      description: 'New Reading Session',
      category: 'Actions',
      action: () => navigate('/session/new'),
    },
    {
      key: 'b',
      ctrl: true,
      shift: true,
      description: 'Add New Book',
      category: 'Actions',
      action: () => navigate('/book/new'),
    },
    {
      key: 'Escape',
      description: 'Close Modals / Dialogs',
      category: 'Navigation',
      action: () => {
        // Close any open modals/dialogs by navigating back or to home
        if (location.pathname.includes('/edit') || location.pathname.includes('/new')) {
          navigate(-1);
        }
      },
    },
  ]);

  // Handle Escape key globally for closing modals
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const target = event.target as HTMLElement;
        // Don't close if user is typing
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        
        // Check if there are any open modals or forms
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          // Find and close the topmost modal
          const lastModal = modals[modals.length - 1] as HTMLElement;
          const closeButton = lastModal.querySelector('[aria-label*="close"], [aria-label*="Close"]');
          if (closeButton) {
            (closeButton as HTMLElement).click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [location]);

  return null;
}

