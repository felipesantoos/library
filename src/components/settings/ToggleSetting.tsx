import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';

interface ToggleSettingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  metaText?: string;
}

export function ToggleSetting({
  icon,
  title,
  description,
  checked,
  onChange,
  label,
  metaText,
}: ToggleSettingProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          {icon}
          <Heading level={4}>{title}</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          {description}
        </Paragraph>
        <div className="pt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
            />
            <span className="text-sm">{label}</span>
          </label>
        </div>
        {metaText && (
          <Paragraph variant="secondary" className="text-xs text-text-secondary">
            {metaText}
          </Paragraph>
        )}
      </Stack>
    </Section>
  );
}

