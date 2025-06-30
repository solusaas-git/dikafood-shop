import React, { useState, useEffect } from 'react';
import { tv } from 'tailwind-variants';

// Styles for tabs components
const styles = {
  container: 'w-full',

  tabList: tv({
    base: 'flex',
    variants: {
      variant: {
        default: 'border-b border-neutral-200',
        pills: 'gap-2',
        enclosed: 'border-b border-neutral-200',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      fullWidth: false,
    },
  }),

  tab: tv({
    base: 'flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dark-green-6',
    variants: {
      variant: {
        default: 'px-4 py-2 border-b-2 border-transparent -mb-px',
        pills: 'px-4 py-2 rounded-full',
        enclosed: 'px-4 py-2 border border-transparent rounded-t-lg -mb-px',
      },
      isActive: {
        true: '',
        false: '',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
      fullWidth: {
        true: 'flex-1',
        false: '',
      },
    },
    compoundVariants: [
      // Default variant active state
      {
        variant: 'default',
        isActive: true,
        class: 'border-b-2 border-dark-green-6 text-dark-green-7 font-medium',
      },
      {
        variant: 'default',
        isActive: false,
        class: 'text-dark-green-6 hover:text-dark-green-7 hover:border-dark-green-5',
      },
      // Pills variant active state
      {
        variant: 'pills',
        isActive: true,
        class: 'bg-dark-green-6 text-white font-medium',
      },
      {
        variant: 'pills',
        isActive: false,
        class: 'text-dark-green-6 hover:text-dark-green-7 hover:bg-dark-green-1',
      },
      // Enclosed variant active state
      {
        variant: 'enclosed',
        isActive: true,
        class: 'border border-neutral-200 border-b-white bg-white text-dark-green-7 font-medium',
      },
      {
        variant: 'enclosed',
        isActive: false,
        class: 'text-dark-green-6 hover:text-dark-green-7 bg-neutral-50 hover:bg-white',
      },
    ],
    defaultVariants: {
      variant: 'default',
      isActive: false,
      isDisabled: false,
      fullWidth: false,
    },
  }),

  tabIcon: 'mr-2',

  tabPanel: 'py-4',
};

/**
 * Tabs component for tabbed navigation and content
 *
 * @param {Array} tabs - Array of tab objects with id, label, icon, content, and isDisabled properties
 * @param {string} variant - Visual variant (default, pills, enclosed)
 * @param {string} defaultTabId - ID of the default active tab
 * @param {boolean} fullWidth - Whether tabs should take full width
 * @param {function} onChange - Callback function when tab changes
 * @param {string} className - Additional CSS classes
 */
export default function Tabs({
  tabs = [],
  variant = 'default',
  defaultTabId,
  fullWidth = false,
  onChange,
  className,
  ...props
}) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || (tabs[0]?.id));

  useEffect(() => {
    if (defaultTabId) {
      setActiveTabId(defaultTabId);
    }
  }, [defaultTabId]);

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  return (
    <div className={`${styles.container} ${className || ''}`} {...props}>
      {/* Tab list */}
      <div
        className={styles.tabList({ variant, fullWidth })}
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={styles.tab({
              variant,
              isActive: tab.id === activeTabId,
              isDisabled: tab.isDisabled,
              fullWidth,
            })}
            role="tab"
            aria-selected={tab.id === activeTabId}
            aria-controls={`panel-${tab.id}`}
            tabIndex={tab.id === activeTabId ? 0 : -1}
            disabled={tab.isDisabled}
            onClick={() => !tab.isDisabled && handleTabClick(tab.id)}
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {activeTab && (
        <div
          id={`panel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          className={styles.tabPanel}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}