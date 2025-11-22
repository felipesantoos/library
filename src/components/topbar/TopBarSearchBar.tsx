import { Search } from 'lucide-react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface TopBarSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TopBarSearchBar({
  value,
  onChange,
  placeholder = 'Search for books, notes…',
}: TopBarSearchBarProps) {
  return (
    <div className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary dark:text-dark-text-secondary z-10" />
        <HandDrawnBox
          borderRadius={6}
          strokeWidth={1}
          linearCorners={true}
          className="w-full"
        >
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:outline-none"
          />
        </HandDrawnBox>
      </div>
    </div>
  );
}

