/**
 * Select Component - REUSABLE
 *
 * Dropdown select with full keyboard navigation and ARIA support.
 * 100% design tokens, cross-browser compatible.
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Enter, Escape, Tab)
 * - ARIA compliant (role="listbox", aria-expanded, aria-selected)
 * - Click outside to close
 * - Full width or auto width
 * - Placeholder support
 * - Disabled state
 *
 * Usage:
 * <Select
 *   value={selectedValue}
 *   options={[{ label: 'Option 1', value: '1' }]}
 *   onChange={(value) => console.log(value)}
 *   placeholder="Select an option"
 * />
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  /** Current selected value */
  value: string | number;
  /** Array of options */
  options: SelectOption[];
  /** Change handler */
  onChange: (value: string | number) => void;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Full width (default: false) */
  fullWidth?: boolean;
  /** Custom className */
  className?: string;
}

export function Select({
  value,
  options,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  fullWidth = false,
  className = '',
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    return undefined;
  }, [isOpen]);

  // Handle option selection
  const handleSelect = useCallback(
    (optionValue: string | number) => {
      if (disabled) return;
      onChange(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    },
    [disabled, onChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else if (focusedIndex >= 0) {
            const option = options[focusedIndex];
            if (option && !option.disabled) {
              handleSelect(option.value);
            }
          }
          break;

        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => {
              const nextIndex = prev + 1;
              return nextIndex < options.length ? nextIndex : prev;
            });
          }
          break;

        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            setFocusedIndex((prev) => {
              const nextIndex = prev - 1;
              return nextIndex >= 0 ? nextIndex : 0;
            });
          }
          break;

        case 'Tab':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [disabled, isOpen, focusedIndex, options, handleSelect]
  );

  // Toggle dropdown
  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setFocusedIndex(0);
    }
  }, [disabled, isOpen]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${
        disabled ? styles.disabled : ''
      } ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select option"
      >
        <span className={`${styles.value} ${!selectedOption ? styles.placeholder : ''}`}>
          {displayValue}
        </span>
        <span className={styles.arrow} aria-hidden="true">
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <ul
          ref={listRef}
          className={styles.dropdown}
          role="listbox"
          aria-label="Options"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isFocused = index === focusedIndex;
            const isDisabled = option.disabled || false;

            return (
              <li
                key={option.value}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${
                  isFocused ? styles.optionFocused : ''
                } ${isDisabled ? styles.optionDisabled : ''}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
                onClick={() => !isDisabled && handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
