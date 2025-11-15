import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip = ({ content, children, position = 'top', delay = 200 }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2 + scrollX;
            y = rect.top + scrollY - 8;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2 + scrollX;
            y = rect.bottom + scrollY + 8;
            break;
          case 'left':
            x = rect.left + scrollX - 8;
            y = rect.top + rect.height / 2 + scrollY;
            break;
          case 'right':
            x = rect.right + scrollX + 8;
            y = rect.top + rect.height / 2 + scrollY;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTransformOrigin = () => {
    switch (position) {
      case 'top':
        return 'bottom center';
      case 'bottom':
        return 'top center';
      case 'left':
        return 'right center';
      case 'right':
        return 'left center';
    }
  };

  const getPosition = () => {
    switch (position) {
      case 'top':
        return { left: coords.x, top: coords.y, transform: 'translate(-50%, -100%)' };
      case 'bottom':
        return { left: coords.x, top: coords.y, transform: 'translate(-50%, 0)' };
      case 'left':
        return { left: coords.x, top: coords.y, transform: 'translate(-100%, -50%)' };
      case 'right':
        return { left: coords.x, top: coords.y, transform: 'translate(0, -50%)' };
    }
  };

  const tooltipContent = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'absolute',
            ...getPosition(),
            transformOrigin: getTransformOrigin(),
            zIndex: 9999,
          }}
          className="px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {createPortal(tooltipContent, document.body)}
    </>
  );
};



