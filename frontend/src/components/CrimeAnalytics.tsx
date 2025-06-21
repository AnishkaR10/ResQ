'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Calendar, MapPin } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}

interface AnalyticsProps {
  reports: Report[];
}

const COLORS = [
  '#ef4444', '#f97316', '#a855f7', '#ec4899', 
  '#eab308', '#3b82f6', '#6b7280', '#10b981'
];

export default function CrimeAnalytics({ reports }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Filter reports based on time range
  const getFilteredReports = () => {
    if (timeRange === 'all') return reports;
    
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    return reports.filter(report => new Date(report.createdAt) >= cutoff);
  };

  const filteredReports = getFilteredReports();

  // Category distribution
  const categoryData = filteredReports.reduce((acc, report) => {
    const category = report.category.replace('_', ' ').toUpperCase();
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    category,
    count
  }));

  // Time series data (daily)
  const getTimeSeriesData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayReports = filteredReports.filter(report =>
        report.createdAt.split('T')[0] === dateStr
      );
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reports: dayReports.length
      });
    }
    
    return data;
  };

  const timeSeriesData = getTimeSeriesData();

  // Calculate stats
  const totalReports = filteredReports.length;
  const previousPeriodReports = reports.filter(report => {
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const periodStart = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    const previousPeriodStart = new Date(now.getTime() - 2 * daysBack * 24 * 60 * 60 * 1000);
    
    const reportDate = new Date(report.createdAt);
    return reportDate >= previousPeriodStart && reportDate < periodStart;
  }).length;

  const percentageChange = previousPeriodReports === 0 
    ? totalReports > 0 ? 100 : 0
    : ((totalReports - previousPeriodReports) / previousPeriodReports) * 100;

  const mostCommonCategory = Object.entries(categoryData).reduce((a, b) => 
    categoryData[a[0]] > categoryData[b[0]] ? a : b, ['', 0]
  )[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Crime Analytics</h2>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 flex items-center">
            <span className={`text-sm ${percentageChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs previous period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Most Common</p>
              <p className="text-lg font-bold text-gray-900 capitalize">
                {mostCommonCategory?.toLowerCase() || 'N/A'}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              {categoryData[mostCommonCategory] || 0} incidents
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">
                {(totalReports / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : Math.max(1, Math.ceil((Date.now() - new Date(reports[reports.length - 1]?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))))).toFixed(1)}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(categoryData).length}</p>
            </div>
            <MapPin className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
    </div>
  );
}