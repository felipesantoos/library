import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  category: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const hasCtrl = event.ctrlKey || event.metaKey; // Ctrl on Windows/Linux, Cmd on Mac
        const hasShift = event.shiftKey;
        const hasAlt = event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        // Check if this shortcut matches
        let matches = keyMatch;

        // Check Ctrl/Cmd requirement
        if (shortcut.ctrl || shortcut.cmd) {
          matches = matches && hasCtrl;
        } else {
          // If no Ctrl/Cmd required, make sure it's not pressed
          matches = matches && !hasCtrl;
        }

        // Check Shift requirement
        if (shortcut.shift !== undefined) {
          matches = matches && (shortcut.shift === hasShift);
        }

        // Check Alt requirement
        if (shortcut.alt !== undefined) {
          matches = matches && (shortcut.alt === hasAlt);
        }

        if (matches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, navigate]);
}

export const defaultShortcuts: Omit<KeyboardShortcut, 'action'>[] = [
  {
    key: 'l',
    ctrl: true,
    description: 'Open Library / Global Search',
    category: 'Navigation',
  },
  {
    key: 'n',
    ctrl: true,
    description: 'New Reading Session',
    category: 'Actions',
  },
  {
    key: 'b',
    ctrl: true,
    shift: true,
    description: 'Add New Book',
    category: 'Actions',
  },
  {
    key: 'Escape',
    description: 'Close Modals / Dialogs',
    category: 'Navigation',
  },
];

