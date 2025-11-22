import { Section, Stack } from '@/components/ui/layout';
import { Heading, MetaText } from '@/components/ui/typography';
import { Calendar } from 'lucide-react';

interface LastBackupInfoProps {
  lastBackupDate: string;
}

export function LastBackupInfo({ lastBackupDate }: LastBackupInfoProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Last Backup</Heading>
        </div>
        <MetaText className="text-sm">
          Last full backup: {new Date(lastBackupDate).toLocaleString()}
        </MetaText>
      </Stack>
    </Section>
  );
}

