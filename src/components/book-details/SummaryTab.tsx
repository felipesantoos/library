import { Stack, Section } from '@/components/ui/layout';
import { Heading, MetaText, Paragraph } from '@/components/ui/typography';
import { Sparkles } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface Summary {
  generated_at: string;
  total_notes: number;
  total_highlights: number;
  key_themes: string[];
  notes_summary: string | null;
  highlights_text: string[];
}

interface SummaryTabProps {
  summary: Summary | null;
  loading: boolean;
  error: string | null;
}

export function SummaryTab({ summary, loading, error }: SummaryTabProps) {
  if (loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <Paragraph>Generating summary...</Paragraph>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error}
          </Paragraph>
        </div>
      </Section>
    );
  }

  if (!summary || (summary.total_notes === 0 && summary.total_highlights === 0)) {
    return <EmptyState type="summary" />;
  }

  return (
    <Stack spacing="md">
      {/* Summary Header */}
      <Section padding="md">
        <Stack spacing="sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent-primary" />
              <Heading level={3}>Book Summary</Heading>
            </div>
            <MetaText className="text-xs">
              Generated {new Date(summary.generated_at).toLocaleDateString()}
            </MetaText>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <MetaText>Total Notes</MetaText>
              <Paragraph className="text-2xl font-bold mt-1">{summary.total_notes}</Paragraph>
            </div>
            <div>
              <MetaText>Total Highlights</MetaText>
              <Paragraph className="text-2xl font-bold mt-1">{summary.total_highlights}</Paragraph>
            </div>
          </div>
        </Stack>
      </Section>

      {/* Key Themes */}
      {summary.key_themes.length > 0 && (
        <Section padding="md">
          <Stack spacing="sm">
            <Heading level={4}>Key Themes</Heading>
            <div className="flex flex-wrap gap-2">
              {summary.key_themes.map((theme, index) => (
                <HandDrawnBox
                  key={index}
                  borderRadius={6}
                  strokeWidth={1}
                  linearCorners={true}
                  className="px-3 py-1 bg-accent-primary/20 text-accent-primary border-accent-primary/30"
                >
                  <span className="text-sm">{theme}</span>
                </HandDrawnBox>
              ))}
            </div>
          </Stack>
        </Section>
      )}

      {/* Notes Summary */}
      {summary.notes_summary && summary.notes_summary !== "No notes recorded for this book." && (
        <Section padding="md">
          <Stack spacing="sm">
            <Heading level={4}>Notes Summary</Heading>
            <HandDrawnBox
              borderRadius={6}
              strokeWidth={1}
              linearCorners={true}
              className="p-4 bg-background-surface"
            >
              <Paragraph className="whitespace-pre-line text-sm">
                {summary.notes_summary}
              </Paragraph>
            </HandDrawnBox>
          </Stack>
        </Section>
      )}

      {/* Highlights */}
      {summary.highlights_text.length > 0 && (
        <Section padding="md">
          <Stack spacing="sm">
            <Heading level={4}>Highlights</Heading>
            <div className="space-y-3">
              {summary.highlights_text.map((highlight, index) => (
                <HandDrawnBox
                  key={index}
                  borderRadius={6}
                  strokeWidth={1}
                  linearCorners={true}
                  className="p-3 bg-background-surface border-l-4 border-accent-secondary"
                >
                  <Paragraph variant="secondary" className="text-sm italic">
                    {highlight}
                  </Paragraph>
                </HandDrawnBox>
              ))}
            </div>
          </Stack>
        </Section>
      )}
    </Stack>
  );
}

