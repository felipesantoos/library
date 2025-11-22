import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSettingProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function ThemeSetting({ theme, onThemeChange }: ThemeSettingProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-accent-primary" />
          ) : (
            <Sun className="w-5 h-5 text-accent-primary" />
          )}
          <Heading level={4}>Theme</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Choose between light and dark mode
        </Paragraph>
        <div className="flex items-center space-x-4 pt-2">
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true}>
            <button
              onClick={() => onThemeChange('light')}
              className={cn(
                'relative w-full flex items-center justify-center space-x-2 px-4 py-2 transition-colors overflow-hidden',
                theme === 'light'
                  ? 'text-accent-primary font-medium bg-accent-primary/10'
                  : 'text-text-secondary hover:bg-background-surface'
              )}
              style={{
                backgroundImage: theme === 'light' ? `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(46, 74, 120, 0.2) 2px,
                  rgba(46, 74, 120, 0.2) 3px
                )` : undefined,
              }}
            >
              <Sun className="w-4 h-4" />
              <span>Light</span>
            </button>
          </HandDrawnBox>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true}>
            <button
              onClick={() => onThemeChange('dark')}
              className={cn(
                'relative w-full flex items-center justify-center space-x-2 px-4 py-2 transition-colors overflow-hidden',
                theme === 'dark'
                  ? 'text-accent-primary font-medium bg-accent-primary/10'
                  : 'text-text-secondary hover:bg-background-surface'
              )}
              style={{
                backgroundImage: theme === 'dark' ? `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  rgba(46, 74, 120, 0.2) 2px,
                  rgba(46, 74, 120, 0.2) 3px
                )` : undefined,
              }}
            >
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </button>
          </HandDrawnBox>
        </div>
      </Stack>
    </Section>
  );
}

