import React, { useState } from 'react';

interface Tab {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  const getTabStyles = (tabId: string) => {
    const isActive = activeTab === tabId;
    
    if (variant === 'pills') {
      return {
        tab: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-100'
        }`,
        indicator: '',
      };
    }
    
    return {
      tab: `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-neutral-600 hover:text-primary-600 hover:border-neutral-300'
      }`,
      indicator: '',
    };
  };
  
  return (
    <div className={className}>
      <div className={`flex ${variant === 'underline' ? 'border-b border-neutral-200' : 'mb-4 space-x-2'}`}>
        {tabs.map((tab) => {
          const styles = getTabStyles(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={styles.tab}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
            role="tabpanel"
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;