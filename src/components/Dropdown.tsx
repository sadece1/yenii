import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  label: string;
  icon?: string;
  onClick?: () => void;
  href?: string;
  divider?: boolean;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
}

export const Dropdown = ({ trigger, items, position = 'right' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${position === 'right' ? 'right-0' : 'left-0'} mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50`}
          >
            <div className="py-1" role="menu">
              {items.map((item, index) => (
                <div key={index}>
                  {item.divider ? (
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                  ) : item.href ? (
                    <a
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2 text-sm ${
                        item.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => !item.disabled && setIsOpen(false)}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </a>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      disabled={item.disabled}
                      className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${
                        item.disabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



