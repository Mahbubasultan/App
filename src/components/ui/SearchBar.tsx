'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onSearch,
  className = '',
}) => {
  return (
    <div className={`flex gap-2 flex-wrap sm:flex-nowrap ${className}`}>
      <div className="relative flex-1 min-w-[200px] sm:min-w-0">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#0B5D3B] focus:border-transparent transition-all placeholder-gray-400 text-gray-900"
        />
      </div>
      <button
        onClick={onSearch}
        className="px-4 py-2 bg-[#0B5D3B] text-white rounded-xl font-medium hover:bg-[#094a2e] transition-all duration-200 text-sm whitespace-nowrap"
      >
        Search
      </button>
    </div>
  );
};
