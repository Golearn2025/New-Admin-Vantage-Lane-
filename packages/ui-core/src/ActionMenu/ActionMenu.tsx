/**
 * ActionMenu Component
 * 
 * Dropdown menu for actions.
 * 100% design tokens, NO business logic, fully modular.
 * 
 * Usage:
 * <ActionMenu
 *   trigger={<ActionButton icon={<More />} label="More" />}
 *   items={[
 *     { icon: <Email />, label: 'Send Email', onClick: handleEmail },
 *     { icon: <Phone />, label: 'Call', onClick: handleCall },
 *   ]}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { ActionMenuProps } from './ActionMenu.types';
import styles from './ActionMenu.module.css';

export function ActionMenu({
  trigger,
  items,
  position = 'bottom-left',
  className = '',
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  const menuClasses = [
    styles.menu,
    styles[position],
    isOpen && styles.open,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container} ref={menuRef}>
      <div onClick={handleTriggerClick} className={styles.trigger}>
        {trigger}
      </div>

      {isOpen && (
        <div className={menuClasses} role="menu">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.separator ? (
                <div className={styles.divider} />
              ) : (
                <button
                  type="button"
                  className={`${styles.item} ${item.danger ? styles.danger : ''} ${
                    item.disabled ? styles.disabled : ''
                  }`}
                  onClick={() => !item.disabled && item.onClick && handleItemClick(item.onClick)}
                  disabled={item.disabled}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className={styles.icon} aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span className={styles.label}>{item.label}</span>
                </button>
              )}
              {item.divider && <div className={styles.divider} />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
