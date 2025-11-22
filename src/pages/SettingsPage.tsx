import { useState } from 'react';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { useBooks } from '@/hooks/useBooks';
import { useSessions } from '@/hooks/useSessions';
import { useNotes } from '@/hooks/useNotes';
import {
  SettingsHeader,
  SettingsTabs,
  AppearanceTab,
  BehaviorTab,
  NotificationsTab,
  DataTab,
  ShortcutsTab,
  SettingsTab,
} from '@/components/settings';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const { books } = useBooks({});
  const { sessions } = useSessions({});
  const { notes } = useNotes({});

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <SettingsHeader />

          <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'appearance' && <AppearanceTab />}
          {activeTab === 'behavior' && <BehaviorTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'data' && (
            <DataTab books={books} sessions={sessions} notes={notes} />
          )}
          {activeTab === 'shortcuts' && <ShortcutsTab />}
        </Stack>
      </div>
    </Container>
  );
}
