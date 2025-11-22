import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FontSizeSettingProps {
  fontSize: 'small' | 'standard' | 'large';
  onFontSizeChange: (size: 'small' | 'standard' | 'large') => void;
}

export function FontSizeSetting({ fontSize, onFontSizeChange }: FontSizeSettingProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <Type className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Font Size</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Adjust the global font size for better readability
        </Paragraph>
        <div className="flex items-center space-x-4 pt-2">
          {(['small', 'standard', 'large'] as const).map((size) => (
            <HandDrawnBox key={size} borderRadius={6} strokeWidth={1} linearCorners={true}>
              <button
                onClick={() => onFontSizeChange(size)}
                className={cn(
                  'relative w-full px-4 py-2 transition-colors capitalize overflow-hidden',
                  fontSize === size
                    ? 'text-accent-primary font-medium bg-accent-primary/10'
                    : 'text-text-secondary hover:bg-background-surface'
                )}
                style={{
                  backgroundImage: fontSize === size ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(46, 74, 120, 0.2) 2px,
                    rgba(46, 74, 120, 0.2) 3px
                  )` : undefined,
                }}
              >
                {size}
              </button>
            </HandDrawnBox>
          ))}
        </div>
      </Stack>
    </Section>
  );
}

