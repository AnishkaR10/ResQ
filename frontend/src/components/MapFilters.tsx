'use client';

import { useState } from 'react';
import { Calendar, Filter, X } from 'lucide-react';

interface MapFiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onReset: () => void;
}

export default function MapFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: MapFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'theft': 'bg-red-100 text-red-800 border-red-200',
      'vandalism': 'bg-orange-100 text-orange-800 border-orange-200',
      'assault': 'bg-purple-100 text-purple-800 border-purple-200',
      'harassment': 'bg-pink-100 text-pink-800 border-pink-200',
      'burglary': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'fraud': 'bg-blue-100 text-blue-800 border-blue-200',
      'other': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const activeFiltersCount = selectedCategories.length + 
    (dateRange.start || dateRange.end ? 1 : 0);

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 bg-white rounded-lg shadow-lg border p-4 w-80 z-[1000]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filter Reports</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Categories Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(category)}`}
                  >
                    {category.replace('_', ' ').toUpperCase()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              onReset();
              setIsOpen(false);
            }}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}