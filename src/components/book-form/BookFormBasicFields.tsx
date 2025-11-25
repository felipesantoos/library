import { CreateBookCommand } from '@/hooks/useBooks';
import { BookFormField } from './BookFormField';
import { DropdownOption } from '@/components/ui/inputs/HandDrawnDropdown';

const BOOK_TYPES: DropdownOption[] = [
  { value: 'physical_book', label: 'Physical Book' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'article', label: 'Article' },
  { value: 'PDF', label: 'PDF' },
  { value: 'comic', label: 'Comic' },
];

const BOOK_STATUSES: DropdownOption[] = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'reading', label: 'Reading' },
  { value: 'paused', label: 'Paused' },
  { value: 'abandoned', label: 'Abandoned' },
  { value: 'completed', label: 'Completed' },
  { value: 'rereading', label: 'Rereading' },
];

interface BookFormBasicFieldsProps {
  formData: CreateBookCommand;
  onChange: (field: keyof CreateBookCommand, value: any) => void;
  isEditing?: boolean;
}

export function BookFormBasicFields({ formData, onChange, isEditing = false }: BookFormBasicFieldsProps) {
  return (
    <>
      {/* Title and Author */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BookFormField
          label="Title"
          required
          type="text"
          value={formData.title}
          onChange={(value) => onChange('title', value)}
          placeholder="Enter book title"
        />
        <BookFormField
          label="Author"
          type="text"
          value={formData.author}
          onChange={(value) => onChange('author', value)}
          placeholder="Enter author name"
        />
      </div>

      {/* Type and Genre */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BookFormField
          label="Type"
          required
          options={BOOK_TYPES}
          dropdownValue={formData.book_type}
          onDropdownChange={(value) => onChange('book_type', value as string)}
          placeholder="Select book type..."
        />
        <BookFormField
          label="Genre"
          type="text"
          value={formData.genre}
          onChange={(value) => onChange('genre', value)}
          placeholder="Enter genre"
        />
      </div>

      {/* Status (only when editing) */}
      {isEditing && (
        <BookFormField
          label="Status"
          options={BOOK_STATUSES}
          dropdownValue={formData.status}
          onDropdownChange={(value) => onChange('status', value as string)}
          placeholder="Select status..."
        />
      )}
    </>
  );
}

