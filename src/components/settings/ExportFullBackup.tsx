import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

interface ExportFullBackupProps {
  exporting: boolean;
  onExport: () => void;
}

export function ExportFullBackup({ exporting, onExport }: ExportFullBackupProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <Download className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Export Full Backup</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Create a complete backup of all your data (books, sessions, notes, goals, journal, agenda)
        </Paragraph>
        <div className="pt-2">
          <Button
            onClick={onExport}
            disabled={exporting}
            variant="primary"
            size="md"
            loading={exporting}
            icon={<Download />}
            iconPosition="left"
          >
            {exporting ? 'Exporting...' : 'Export Full Backup'}
          </Button>
        </div>
        <MetaText className="text-xs text-text-secondary uppercase">
          The backup will be saved as a JSON file containing all your reading data
        </MetaText>
      </Stack>
    </Section>
  );
}

