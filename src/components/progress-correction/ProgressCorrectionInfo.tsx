import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { AlertTriangle } from 'lucide-react';

interface ProgressCorrectionInfoProps {
  hasErrors: boolean;
}

export function ProgressCorrectionInfo({ hasErrors }: ProgressCorrectionInfoProps) {
  return (
    <Section padding="sm" className="bg-accent-primary/10 border-accent-primary/30">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-accent-primary mt-0.5" />
        <div className="flex-1">
          <Paragraph className="text-sm">
            Edit or delete sessions to correct your reading progress. Changes will be saved when you click "Save All Changes".
          </Paragraph>
          {hasErrors && (
            <Paragraph variant="secondary" className="text-semantic-error text-sm mt-2">
              Please fix errors before saving.
            </Paragraph>
          )}
        </div>
      </div>
    </Section>
  );
}

