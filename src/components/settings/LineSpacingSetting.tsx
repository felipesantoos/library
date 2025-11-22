import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Type } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LineSpacingSettingProps {
  lineSpacing: 'tight' | 'normal' | 'relaxed' | 'loose';
  onLineSpacingChange: (spacing: 'tight' | 'normal' | 'relaxed' | 'loose') => void;
}

export function LineSpacingSetting({ lineSpacing, onLineSpacingChange }: LineSpacingSettingProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <Type className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Line Spacing</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Adjust line spacing for reading comfort
        </Paragraph>
        <div className="flex items-center space-x-4 pt-2">
          {(['tight', 'normal', 'relaxed', 'loose'] as const).map((spacing) => (
            <HandDrawnBox key={spacing} borderRadius={6} strokeWidth={1} linearCorners={true}>
              <button
                onClick={() => onLineSpacingChange(spacing)}
                className={cn(
                  'relative w-full px-4 py-2 transition-colors capitalize overflow-hidden',
                  lineSpacing === spacing
                    ? 'text-accent-primary font-medium bg-accent-primary/10'
                    : 'text-text-secondary hover:bg-background-surface'
                )}
                style={{
                  backgroundImage: lineSpacing === spacing ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(46, 74, 120, 0.2) 2px,
                    rgba(46, 74, 120, 0.2) 3px
                  )` : undefined,
                }}
              >
                {spacing}
              </button>
            </HandDrawnBox>
          ))}
        </div>
      </Stack>
    </Section>
  );
}

