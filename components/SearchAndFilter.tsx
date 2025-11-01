
import React from 'react';
import { Category } from '../types';
import { SearchIcon } from './icons/Icons';

interface SearchAndFilterProps {
  categories: Category[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  categories,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-8 sticky top-16 z-30 backdrop-blur-sm bg-white/80">
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome, código ou descrição..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === null ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onCategoryChange(category.slug)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category.slug ? 'bg-accent text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;
