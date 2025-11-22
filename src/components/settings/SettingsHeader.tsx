import { Heading, Paragraph } from '@/components/ui/typography';

export function SettingsHeader() {
  return (
    <div>
        <Heading level={1}>Settings</Heading>
      <Paragraph variant="secondary" className="mt-2">
        Configure your reading experience
      </Paragraph>
    </div>
  );
}

