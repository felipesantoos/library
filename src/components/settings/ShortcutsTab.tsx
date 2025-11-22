import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Keyboard } from 'lucide-react';
import { defaultShortcuts } from '@/hooks/useKeyboardShortcuts';

export function ShortcutsTab() {
  const generalShortcuts = [
    { description: 'Close Modals / Dialogs', keys: ['Esc'] },
    { description: 'Navigate with Tab', keys: ['Tab'] },
    { description: 'Navigate lists with arrows', keys: ['↑', '↓'] },
    { description: 'Open selected item', keys: ['Enter'] },
  ];

  return (
    <Stack spacing="md">
      <Section padding="md">
        <Stack spacing="md">
          <div className="flex items-center space-x-3">
            <Keyboard className="w-5 h-5 text-accent-primary" />
            <Heading level={4}>Keyboard Shortcuts</Heading>
          </div>
          <Paragraph variant="secondary" className="text-sm">
            Quick access to features using keyboard shortcuts
          </Paragraph>

          {['Navigation', 'Actions'].map((category) => (
            <div key={category}>
              <Heading level={5} className="text-sm font-medium mb-3">
                {category}
              </Heading>
              <div className="space-y-2">
                {defaultShortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <HandDrawnBox key={index} borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                      <div className="flex items-center justify-between p-3 bg-background-surface">
                        <span className="text-sm text-text-primary">
                          {shortcut.description}
                        </span>
                        <div className="flex items-center space-x-1">
                          {shortcut.ctrl && (
                            <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-text-secondary bg-background-surface block">
                                {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}
                              </kbd>
                            </HandDrawnBox>
                          )}
                          {shortcut.shift && (
                            <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-text-secondary bg-background-surface block">
                                Shift
                              </kbd>
                            </HandDrawnBox>
                          )}
                          <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                              {shortcut.key.toUpperCase()}
                            </kbd>
                          </HandDrawnBox>
                        </div>
                      </div>
                    </HandDrawnBox>
                  ))}
              </div>
            </div>
          ))}

          <div>
            <Heading level={5} className="text-sm font-medium mb-3">
              General Navigation
            </Heading>
            <div className="space-y-2">
              {generalShortcuts.map((shortcut, index) => (
                <HandDrawnBox key={index} borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <div className="flex items-center justify-between p-3 bg-background-surface">
                    <span className="text-sm text-text-primary">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <HandDrawnBox key={keyIndex} borderRadius={4} strokeWidth={1} linearCorners={true}>
                          <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                            {key}
                          </kbd>
                        </HandDrawnBox>
                      ))}
                    </div>
                  </div>
                </HandDrawnBox>
              ))}
            </div>
          </div>
        </Stack>
      </Section>
    </Stack>
  );
}

