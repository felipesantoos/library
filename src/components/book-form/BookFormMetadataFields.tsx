import { CreateBookCommand } from '@/hooks/useBooks';
import { BookFormField } from './BookFormField';

interface BookFormMetadataFieldsProps {
  formData: CreateBookCommand;
  onChange: (field: keyof CreateBookCommand, value: any) => void;
}

export function BookFormMetadataFields({ formData, onChange }: BookFormMetadataFieldsProps) {
  return (
    <>
      <BookFormField
        label="ISBN"
        type="text"
        value={formData.isbn}
        onChange={(value) => onChange('isbn', value)}
        placeholder="ISBN"
      />

      {/* Cover URL and URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BookFormField
          label="Cover URL"
          type="url"
          value={formData.cover_url}
          onChange={(value) => onChange('cover_url', value)}
          placeholder="https://example.com/cover.jpg"
        />
        <BookFormField
          label="URL (for articles, PDFs, etc.)"
          type="url"
          value={formData.url}
          onChange={(value) => onChange('url', value)}
          placeholder="https://example.com/article"
        />
      </div>
    </>
  );
}

