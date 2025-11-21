import { Heading, Paragraph } from '@/components/ui/typography';

export function HomeHeader() {
  return (
    <div>
      <Heading level={1}>The Reading Desk</Heading>
      <Paragraph variant="secondary" className="mt-2">
        Welcome back to your reading journey
      </Paragraph>
    </div>
  );
}

