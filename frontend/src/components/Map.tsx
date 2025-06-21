'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import MapFilters from './MapFilters';

// Dynamically import the map component with no SSR
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
    <span className="text-gray-500">Loading map...</span>
  </div>
});

interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  photoUrl?: string;
  createdAt: string;
}

interface MapProps {
  reports: Report[];
}

export default function Map({ reports }: MapProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Get unique categories from reports
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(reports.map(report => report.category))];
    return uniqueCategories.sort();
  }, [reports]);

  // Initialize with all categories selected
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories(categories);
    }
  }, [categories, selectedCategories.length]);

  // Filter reports based on selected filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(report.category)) {
        return false;
      }

      // Date range filter
      const reportDate = new Date(report.createdAt);
      if (dateRange.start) {
        const startDate = new Date(dateRange.start);
        if (reportDate < startDate) return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the entire end date
        if (reportDate > endDate) return false;
      }

      return true;
    });
  }, [reports, selectedCategories, dateRange]);

  const handleReset = () => {
    setSelectedCategories(categories);
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <MapFilters
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onReset={handleReset}
        />
        
        {/* Filter Summary */}
        <div className="text-sm text-gray-600">
          Showing {filteredReports.length} of {reports.length} reports
        </div>
      </div>

      {/* Map */}
      <DynamicMap reports={filteredReports} />

      {/* Legend */}
      {categories.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700 mb-3">Legend</h4>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const count = filteredReports.filter(r => r.category === category).length;
              const totalCount = reports.filter(r => r.category === category).length;
              const isActive = selectedCategories.includes(category);
              
              return (
                <div
                  key={category}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor: (() => {
                        const colors: { [key: string]: string } = {
                          'theft': '#ef4444',
                          'vandalism': '#f97316',
                          'assault': '#a855f7',
                          'harassment': '#ec4899',
                          'burglary': '#eab308',
                          'fraud': '#3b82f6',
                          'other': '#6b7280',
                        };
                        return colors[category.toLowerCase()] || '#6b7280';
                      })()
                    }}
                  />
                  <span className="text-sm font-medium capitalize">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({count}/{totalCount})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}