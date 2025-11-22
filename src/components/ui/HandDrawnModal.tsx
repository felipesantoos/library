import { ReactNode, useEffect, useState } from 'react';
import { HandDrawnBox } from './HandDrawnBox';
import { Heading } from './typography';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HandDrawnModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function HandDrawnModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  showCloseButton = true,
  className,
}: HandDrawnModalProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
    >
      <HandDrawnBox
        borderRadius={8}
        strokeWidth={1}
        linearCorners={true}
        className={cn(
          'relative z-[51] w-full p-8 rounded-md',
          'shadow-xl',
          maxWidthClasses[maxWidth],
          className
        )}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: isDark ? '#1A1410' : '#F8F3E8',
        }}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <Heading level={3}>{title}</Heading>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        {children}
      </HandDrawnBox>
    </div>
  );
}

