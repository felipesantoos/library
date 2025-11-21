import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import { HandDrawnBox } from '../HandDrawnBox';
import { DecorativeArrow } from '../DecorativeArrow';
import { useTheme } from '@/theme/ThemeProvider';
import { cn } from '@/lib/utils';

// Types
export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

export type DropdownOptions = DropdownOption[] | DropdownGroup[];

export interface HandDrawnDropdownProps {
  options: DropdownOptions;
  value?: string | number | (string | number)[];
  onChange?: (value: string | number | (string | number)[] | null) => void;
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  borderRadius?: number;
  strokeWidth?: number;
  maxHeight?: number;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

// Flatten options for easier processing
function flattenOptions(options: DropdownOptions): DropdownOption[] {
  if (options.length === 0) return [];
  
  // Check if first item is a group
  if ('options' in options[0]) {
    return (options as DropdownGroup[]).flatMap(group => group.options);
  }
  
  return options as DropdownOption[];
}

// Check if options are grouped
function isGrouped(options: DropdownOptions): boolean {
  if (options.length === 0) return false;
  return 'options' in options[0];
}

export function HandDrawnDropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  multiple = false,
  searchable = false,
  disabled = false,
  className,
  triggerClassName,
  menuClassName,
  borderRadius = 6,
  strokeWidth = 1,
  maxHeight = 300,
  emptyMessage = 'No options found',
  searchPlaceholder = 'Search...',
}: HandDrawnDropdownProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
  // Get background color based on theme
  const backgroundColor = theme === 'dark' ? '#1A1410' : '#F8F3E8';
  
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const grouped = isGrouped(options);
  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  // Get selected values as array
  const selectedValues = useMemo(() => {
    if (value === undefined || value === null) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase().trim();
    
    if (grouped) {
      return (options as DropdownGroup[]).map(group => ({
        ...group,
        options: group.options.filter(opt =>
          opt.label.toLowerCase().includes(query) && !opt.disabled
        ),
      })).filter(group => group.options.length > 0);
    } else {
      return (options as DropdownOption[]).filter(opt =>
        opt.label.toLowerCase().includes(query) && !opt.disabled
      );
    }
  }, [options, searchQuery, searchable, grouped]);

  // Get display text for trigger
  const displayText = useMemo(() => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    if (multiple) {
      if (selectedValues.length === 1) {
        const opt = flatOptions.find(o => o.value === selectedValues[0]);
        return opt?.label || placeholder;
      }
      return `${selectedValues.length} selected`;
    } else {
      const opt = flatOptions.find(o => o.value === selectedValues[0]);
      return opt?.label || placeholder;
    }
  }, [selectedValues, flatOptions, placeholder, multiple]);

  // Check if option is selected
  const isSelected = useCallback((optionValue: string | number) => {
    return selectedValues.includes(optionValue);
  }, [selectedValues]);

  // Handle option click
  const handleOptionClick = useCallback((option: DropdownOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValues = [...selectedValues];
      const index = newValues.indexOf(option.value);
      
      if (index > -1) {
        newValues.splice(index, 1);
      } else {
        newValues.push(option.value);
      }
      
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  }, [multiple, selectedValues, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        } else if (focusedIndex >= 0) {
          e.preventDefault();
          const flatFiltered = flattenOptions(filteredOptions);
          if (flatFiltered[focusedIndex]) {
            handleOptionClick(flatFiltered[focusedIndex]);
          }
        }
        break;
      
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const flatFiltered = flattenOptions(filteredOptions);
          setFocusedIndex(prev => 
            prev < flatFiltered.length - 1 ? prev + 1 : prev
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const flatFiltered = flattenOptions(filteredOptions);
          setFocusedIndex(prev => prev > 0 ? prev - 1 : 0);
        }
        break;
      
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
          setFocusedIndex(-1);
        }
        break;
    }
  }, [isOpen, focusedIndex, filteredOptions, disabled, handleOptionClick]);

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRefs.current[focusedIndex]) {
      optionsRefs.current[focusedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [focusedIndex, isOpen]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  // Close menu on click outside (check both trigger and menu)
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
      setSearchQuery('');
      setFocusedIndex(-1);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Get menu position
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    } else {
      setMenuPosition(null);
    }
  }, [isOpen]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFocusedIndex(-1);
  };

  // Clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange?.([]);
    } else {
      onChange?.(null);
    }
  };

  const flatFiltered = flattenOptions(filteredOptions);
  const hasOptions = flatFiltered.length > 0;

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('relative', className)}
      >
        <HandDrawnBox
          borderRadius={borderRadius}
          strokeWidth={strokeWidth}
          linearCorners={true}
          className={cn('w-full', triggerClassName)}
        >
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              'w-full px-3 py-2 rounded-md bg-background-surface text-text-primary',
              'focus:outline-none',
              'flex items-center justify-between gap-2',
              'transition-colors',
              disabled && 'opacity-50 cursor-not-allowed',
              !disabled && 'cursor-pointer hover:bg-background-surface/80'
            )}
          >
            <span className={cn(
              'flex-1 text-left truncate',
              selectedValues.length === 0 && 'text-text-secondary'
            )}>
              {displayText}
            </span>
            
            <div className="flex items-center gap-1 flex-shrink-0">
              {!multiple && selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-background-surface/50 rounded transition-colors"
                  aria-label="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              
              {multiple && selectedValues.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-accent-primary/20 text-accent-primary rounded">
                  {selectedValues.length}
                </span>
              )}
              
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform',
                  isOpen && 'transform rotate-180'
                )}
              />
            </div>
          </button>
        </HandDrawnBox>

        {/* Selected badges for multiple selection */}
        {multiple && selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedValues.slice(0, 3).map(val => {
              const opt = flatOptions.find(o => o.value === val);
              if (!opt) return null;
              
              return (
                <div
                  key={val}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-accent-primary/20 text-accent-primary rounded"
                >
                  <span className="truncate max-w-[120px]">{opt.label}</span>
                  <button
                    type="button"
                    onClick={() => handleOptionClick(opt)}
                    className="hover:bg-accent-primary/30 rounded p-0.5"
                    aria-label={`Remove ${opt.label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
            {selectedValues.length > 3 && (
              <div className="inline-flex items-center px-2 py-1 text-xs bg-accent-primary/20 text-accent-primary rounded">
                +{selectedValues.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && menuPosition && createPortal(
        <div
          ref={menuRef}
          className={cn(
            'fixed z-[9999]',
            'transition-all duration-200 ease-out',
            menuClassName
          )}
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`,
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
          }}
        >
          <div
            className="relative shadow-lg"
            style={{ 
              width: menuPosition.width,
            }}
          >
            <div
              className="relative"
              style={{
                width: '100%',
                backgroundColor: backgroundColor,
              }}
            >
              <HandDrawnBox
                borderRadius={borderRadius}
                strokeWidth={strokeWidth}
                linearCorners={true}
                className="relative"
                style={{ width: '100%' }}
              >
                <div
                  ref={menuContentRef}
                  className="relative"
                  style={{
                    maxHeight: `${maxHeight}px`,
                    overflowY: 'auto',
                    minHeight: '40px',
                    backgroundColor: 'inherit',
                  }}
                >
              {/* Search Input */}
              {searchable && (
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder={searchPlaceholder}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-transparent text-text-primary focus:outline-none border-0"
                      style={{ backgroundColor: backgroundColor }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          handleKeyDown(e);
                        }
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="py-1">
                {!hasOptions ? (
                  <div className="px-3 py-4 text-center text-sm text-text-secondary">
                    {emptyMessage}
                  </div>
                ) : grouped ? (
                  // Grouped options
                  (filteredOptions as DropdownGroup[]).map((group, groupIndex) => (
                    <div key={group.label || groupIndex} className="mb-1">
                      {group.label && (
                        <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                          {group.label}
                        </div>
                      )}
                      {group.options.map((option, optionIndex) => {
                        const flatIndex = flatFiltered.findIndex(o => o.value === option.value);
                        const selected = isSelected(option.value);
                        
                        return (
                          <div
                            key={option.value}
                            ref={el => {
                              if (flatIndex >= 0) {
                                optionsRefs.current[flatIndex] = el;
                              }
                            }}
                            onClick={() => handleOptionClick(option)}
                            className={cn(
                              'px-3 py-2 text-sm cursor-pointer transition-all duration-150',
                              'flex items-center gap-2',
                              selected && 'bg-accent-primary/10',
                              flatIndex === focusedIndex && 'bg-accent-primary/20',
                              !selected && flatIndex !== focusedIndex && !option.disabled && 'hover:bg-accent-primary/10 hover:scale-[1.01]',
                              option.disabled && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            <span>{option.label}</span>
                            {selected && (
                              <DecorativeArrow size={16} className="text-accent-primary flex-shrink-0" />
                            )}
                            {multiple && !selected && (
                              <div className="w-4 h-4 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  // Flat options
                  (filteredOptions as DropdownOption[]).map((option, index) => {
                    const selected = isSelected(option.value);
                    
                    return (
                      <div
                        key={option.value}
                        ref={el => {
                          optionsRefs.current[index] = el;
                        }}
                        onClick={() => handleOptionClick(option)}
                        className={cn(
                          'px-3 py-2 text-sm cursor-pointer transition-all duration-150',
                          'flex items-center gap-2',
                          selected && 'bg-accent-primary/10',
                          index === focusedIndex && 'bg-accent-primary/20',
                          !selected && index !== focusedIndex && !option.disabled && 'hover:bg-accent-primary/10 hover:scale-[1.01]',
                          option.disabled && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <span>{option.label}</span>
                        {selected && (
                          <DecorativeArrow size={40} stroke="currentColor" strokeWidth={50} className="text-accent-primary flex-shrink-0" />
                        )}
                        {multiple && !selected && (
                          <div className="w-4 h-4 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </HandDrawnBox>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

