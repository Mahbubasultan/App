'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  showButton?: boolean;
  onClear?: () => void;
  filterElement?: React.ReactNode;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search by name, ID, email, etc…',
  onSearch = () => {},
  showButton = false,
  onClear,
  filterElement,
  className = '',
}) => {
  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap sm:flex-nowrap ${className}`}>
      <div className="relative flex-1 min-w-[220px]">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          className="w-full pl-12 pr-12 py-3 text-sm border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {filterElement && <div className="flex items-center">{filterElement}</div>}

      {showButton && (
        <button
          type="button"
          onClick={onSearch}
          className="min-w-[110px] h-12 px-4 bg-[#0B5D3B] text-white rounded-full font-semibold hover:bg-[#094a2e] transition-all duration-200 text-sm flex items-center justify-center shadow-sm"
        >
          Search
        </button>
      )}
    </div>
  );
};
