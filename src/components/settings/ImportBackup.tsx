import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Upload, AlertTriangle } from 'lucide-react';

interface ImportBackupProps {
  importing: boolean;
  exporting: boolean;
  onImport: () => void;
}

export function ImportBackup({ importing, exporting, onImport }: ImportBackupProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <Upload className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Import Backup</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Restore data from a backup file
        </Paragraph>
        <div className="pt-2">
          <Button
            onClick={onImport}
            disabled={importing || exporting}
            variant="outline"
            size="md"
            loading={importing}
            icon={<Upload />}
            iconPosition="left"
          >
            {importing ? 'Importing...' : 'Import Backup'}
          </Button>
        </div>
        <MetaText className="text-xs text-semantic-warning uppercase flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          <span>Import functionality will validate the backup and allow you to merge or overwrite data</span>
        </MetaText>
      </Stack>
    </Section>
  );
}

