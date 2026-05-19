'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  showButton?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onSearch = () => {},
  showButton = true,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 flex-wrap sm:flex-nowrap ${className}`}>
      <div className="relative flex-1 min-w-[260px] max-w-[340px]">
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
          className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
        />
      </div>
      {showButton && (
        <button
          type="button"
          onClick={onSearch}
          className="w-[110px] h-12 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all duration-200 text-sm flex items-center justify-center"
        >
          Search
        </button>
      )}
    </div>
  );
};
