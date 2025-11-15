import { useState } from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  onChange?: (tabId: string) => void;
}

export const Tabs = ({ tabs, defaultTab, variant = 'default', onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      button: 'px-6 py-3 font-medium transition-colors relative',
      active: 'text-primary-600 dark:text-primary-400',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
      indicator: true,
    },
    pills: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex gap-1',
      button: 'px-4 py-2 rounded-md font-medium transition-all',
      active: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
      indicator: false,
    },
    underline: {
      container: 'flex gap-8',
      button: 'pb-3 font-medium transition-colors border-b-2',
      active: 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400',
      inactive: 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200',
      indicator: false,
    },
  };

  const styles = variantStyles[variant];

  return (
    <div>
      {/* Tab Buttons */}
      <div className={styles.container}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={`${styles.button} ${
                activeTab === tab.id ? styles.active : styles.inactive
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              
              {/* Animated indicator for default variant */}
              {variant === 'default' && activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-6"
      >
        {activeTabContent}
      </motion.div>
    </div>
  );
};



