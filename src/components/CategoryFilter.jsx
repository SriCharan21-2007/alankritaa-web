import React from 'react';

/**
 * CategoryFilter - Tab bar selector for filtering categories/subcategories.
 * Renders horizontally scrollable tabs with transition states and gold accents.
 * 
 * @param {Object} props
 * @param {string} props.activeTab - Currently selected tab value.
 * @param {Array<string>} props.tabs - Array of tab strings to render.
 * @param {function} props.onTabChange - Callback when a tab is clicked.
 */
const CategoryFilter = ({ activeTab, tabs, onTabChange }) => {
  return (
    <div className="w-full flex justify-center mb-10 px-4">
      {/* Scrollable Container for Mobile, Centered for Desktop */}
      <div className="flex space-x-2 p-1.5 bg-white border border-gold/10 rounded-full shadow-md max-w-full overflow-x-auto scrollbar-none snap-x select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap snap-center transition-all duration-300 ${
                isActive
                  ? 'bg-burgundy text-gold shadow-md'
                  : 'text-charcoal-light hover:text-burgundy hover:bg-rose/10'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
