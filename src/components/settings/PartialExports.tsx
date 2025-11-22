import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { FileText, Calendar } from 'lucide-react';

interface PartialExportsProps {
  books: BookDto[];
  exporting: boolean;
  selectedBookId: number | undefined;
  onExportYearStats: (year: number) => void;
  onExportSingleBook: (bookId: number) => void;
  onExportNotes: () => void;
}

export function PartialExports({
  books,
  exporting,
  selectedBookId,
  onExportYearStats,
  onExportSingleBook,
  onExportNotes,
}: PartialExportsProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Partial Exports</Heading>
        </div>
        <Paragraph variant="secondary" className="text-sm">
          Export specific data for research, sharing, or analysis
        </Paragraph>
        
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
            <div className="flex-1">
              <Paragraph className="text-sm font-medium">Export Year Statistics</Paragraph>
              <MetaText className="text-xs uppercase">Sessions and books completed in a specific year</MetaText>
            </div>
            <div className="ml-4">
              <Button
                onClick={() => {
                  const currentYear = new Date().getFullYear();
                  const yearInput = prompt(`Enter year to export:`, currentYear.toString());
                  if (yearInput) {
                    const year = parseInt(yearInput);
                    if (!isNaN(year)) {
                      onExportYearStats(year);
                    }
                  }
                }}
                disabled={exporting}
                variant="outline"
                size="sm"
                icon={<Calendar />}
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
            <div className="flex-1">
              <Paragraph className="text-sm font-medium">Export Single Book</Paragraph>
              <MetaText className="text-xs uppercase">Book data, sessions, and notes for research</MetaText>
            </div>
            <div className="ml-4 min-w-[200px]">
              <HandDrawnDropdown
                options={books.map((book) => ({
                  value: book.id ?? 0,
                  label: book.title,
                }))}
                value={selectedBookId}
                placeholder="Select book..."
                onChange={(value) => {
                  if (value && typeof value === 'number') {
                    onExportSingleBook(value);
                  }
                }}
                disabled={exporting}
                borderRadius={6}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
            <div className="flex-1">
              <Paragraph className="text-sm font-medium">Export Notes</Paragraph>
              <MetaText className="text-xs uppercase">All your notes</MetaText>
            </div>
            <div className="ml-4">
              <Button
                onClick={onExportNotes}
                disabled={exporting}
                variant="outline"
                size="sm"
                icon={<FileText />}
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}

