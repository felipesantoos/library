import { Section } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Search, X } from 'lucide-react';

interface NotesSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesSearch({ value, onChange }: NotesSearchProps) {
  return (
    <Section padding="sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary z-10" />
        <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
          <input
            type="text"
            placeholder="Search notes..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
          />
        </HandDrawnBox>
        {value && (
          <Button
            onClick={() => onChange('')}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<X className="w-4 h-4" />}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
          />
        )}
      </div>
    </Section>
  );
}

