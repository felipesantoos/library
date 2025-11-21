import { CreateBookCommand } from '@/hooks/useBooks';
import { BookFormField } from './BookFormField';

interface BookFormProgressFieldsProps {
  formData: CreateBookCommand;
  onChange: (field: keyof CreateBookCommand, value: any) => void;
}

export function BookFormProgressFields({ formData, onChange }: BookFormProgressFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {formData.book_type === 'audiobook' ? (
        <BookFormField
          label="Total Minutes"
          required
          type="number"
          value={formData.total_minutes}
          onChange={(value) => onChange('total_minutes', value)}
          placeholder="Enter total minutes"
          min={1}
        />
      ) : (
        <BookFormField
          label="Total Pages"
          required
          type="number"
          value={formData.total_pages}
          onChange={(value) => onChange('total_pages', value)}
          placeholder="Enter total pages"
          min={1}
        />
      )}

      <BookFormField
        label="Publication Year"
        type="number"
        value={formData.publication_year}
        onChange={(value) => onChange('publication_year', value)}
        placeholder="Year"
        min={0}
        max={new Date().getFullYear()}
      />
    </div>
  );
}

