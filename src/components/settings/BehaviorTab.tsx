import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Type, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBehaviorSettings } from './hooks/useBehaviorSettings';
import { ToggleSetting } from './ToggleSetting';

export function BehaviorTab() {
  const {
    defaultProgressUnit,
    autoOpenTimer,
    defaultStartPage,
    handleProgressUnitChange,
    handleAutoOpenTimerChange,
    handleDefaultStartPageChange,
  } = useBehaviorSettings();

  return (
    <Stack spacing="md">
      <Section padding="md">
        <Stack spacing="sm">
          <div className="flex items-center space-x-3">
            <Type className="w-5 h-5 text-accent-primary" />
            <Heading level={4}>Default Progress Unit</Heading>
          </div>
          <Paragraph variant="secondary" className="text-sm">
            Choose how progress is displayed by default (pages or percentage)
          </Paragraph>
          <div className="flex items-center space-x-4 pt-2">
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true}>
              <button
                onClick={() => handleProgressUnitChange('page')}
                className={cn(
                  'relative w-full px-4 py-2 transition-colors overflow-hidden',
                  defaultProgressUnit === 'page'
                    ? 'text-accent-primary font-medium bg-accent-primary/10'
                    : 'text-text-secondary hover:bg-background-surface'
                )}
                style={{
                  backgroundImage: defaultProgressUnit === 'page' ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(46, 74, 120, 0.2) 2px,
                    rgba(46, 74, 120, 0.2) 3px
                  )` : undefined,
                }}
              >
                Pages
              </button>
            </HandDrawnBox>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true}>
              <button
                onClick={() => handleProgressUnitChange('percentage')}
                className={cn(
                  'relative w-full px-4 py-2 transition-colors overflow-hidden',
                  defaultProgressUnit === 'percentage'
                    ? 'text-accent-primary font-medium bg-accent-primary/10'
                    : 'text-text-secondary hover:bg-background-surface'
                )}
                style={{
                  backgroundImage: defaultProgressUnit === 'percentage' ? `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(46, 74, 120, 0.2) 2px,
                    rgba(46, 74, 120, 0.2) 3px
                  )` : undefined,
                }}
              >
                Percentage
              </button>
            </HandDrawnBox>
          </div>
        </Stack>
      </Section>

      <ToggleSetting
        icon={<Clock className="w-5 h-5 text-accent-primary" />}
        title="Default Session Behavior"
        description="Configure how new reading sessions behave"
        checked={autoOpenTimer}
        onChange={handleAutoOpenTimerChange}
        label="Open timer automatically when starting a session"
      />

      <Section padding="md">
        <Stack spacing="sm">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-accent-primary" />
            <Heading level={4}>Default Start Page</Heading>
          </div>
          <Paragraph variant="secondary" className="text-sm">
            Set the default starting page when creating a new book
          </Paragraph>
          <div className="pt-2">
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-32">
              <input
                type="number"
                min="1"
                value={defaultStartPage}
                onChange={(e) => handleDefaultStartPageChange(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none border-0"
                placeholder="1"
              />
            </HandDrawnBox>
            <MetaText className="text-xs text-text-secondary mt-1 block">
              Usually 1, but you can set a different default if needed
            </MetaText>
          </div>
        </Stack>
      </Section>
    </Stack>
  );
}

