import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { DropdownOption } from '@/components/ui/inputs/HandDrawnDropdown';

interface BookFormFieldProps {
  label: string;
  required?: boolean;
  type?: 'text' | 'number' | 'url';
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: DropdownOption[];
  dropdownValue?: string | number;
  onDropdownChange?: (value: string | number | null) => void;
}

export function BookFormField({
  label,
  required = false,
  type = 'text',
  value,
  onChange,
  placeholder,
  min,
  max,
  options,
  dropdownValue,
  onDropdownChange,
}: BookFormFieldProps) {
  if (options && onDropdownChange) {
    return (
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          {label} {required && '*'}
        </label>
        <HandDrawnDropdown
          options={options}
          value={dropdownValue}
          onChange={onDropdownChange}
          placeholder={placeholder}
          borderRadius={6}
          strokeWidth={1}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-1">
        {label} {required && '*'}
      </label>
      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
        <input
          type={type}
          required={required}
          min={min}
          max={max}
          value={value || ''}
          onChange={(e) => {
            if (type === 'number') {
              const numValue = e.target.value ? parseInt(e.target.value) : undefined;
              onChange(numValue);
            } else {
              onChange(e.target.value || undefined);
            }
          }}
          className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
          placeholder={placeholder}
        />
      </HandDrawnBox>
    </div>
  );
}

