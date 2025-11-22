import { Stack } from '@/components/ui/layout';
import { Bell } from 'lucide-react';
import { useNotificationSettings } from './hooks/useNotificationSettings';
import { ToggleSetting } from './ToggleSetting';

export function NotificationsTab() {
  const {
    dailyReminder,
    readingPrompt,
    goalReminders,
    handleDailyReminderChange,
    handleReadingPromptChange,
    handleGoalRemindersChange,
  } = useNotificationSettings();

  return (
    <Stack spacing="md">
      <ToggleSetting
        icon={<Bell className="w-5 h-5 text-accent-primary" />}
        title="Daily Reminder"
        description="Receive a daily reminder to read"
        checked={dailyReminder}
        onChange={handleDailyReminderChange}
        label="Enable daily reading reminder"
        metaText="Note: Notification implementation will be added in a future update"
      />

      <ToggleSetting
        icon={<Bell className="w-5 h-5 text-accent-primary" />}
        title="Reading Prompt"
        description="Get prompted if you haven't read today"
        checked={readingPrompt}
        onChange={handleReadingPromptChange}
        label="Show prompt if you haven't read today"
        metaText="A gentle reminder will appear if no reading session was recorded today"
      />

      <ToggleSetting
        icon={<Bell className="w-5 h-5 text-accent-primary" />}
        title="Goal Reminders"
        description="Receive reminders about your reading goals"
        checked={goalReminders}
        onChange={handleGoalRemindersChange}
        label="Enable goal progress reminders"
        metaText="Get notified about your progress toward monthly and yearly goals"
      />
    </Stack>
  );
}

