'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Map from '@/components/Map';
import ReportForm from '@/components/ReportForm';
import CrimeAnalytics from '@/components/CrimeAnalytics';
import AdminDashboard from '@/components/AdminDashboard';
import Header from '@/components/Header';
import { Plus, X } from 'lucide-react';

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

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'analytics' | 'admin'>('map');

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportCreated = () => {
    fetchReports();
    setShowForm(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Section Header with Report Button */}
            <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {activeTab === 'map' ? 'Crime Map' : 'Crime Analytics'}
                </h2>
                <p className="text-lg text-gray-600 mt-1">
                  {reports.length} verified {reports.length === 1 ? 'report' : 'reports'} found
                </p>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
              >
                {showForm ? (
                  <>
                    <X className="w-4 h-4" />
                    Hide Form
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Report Incident
                  </>
                )}
              </button>
            </div>

            {/* Report Form */}
            {showForm && (
              <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
                <ReportForm onReportCreated={handleReportCreated} />
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'map' ? (
              <>
                {/* Map Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <Map reports={reports} />
                </div>

                {/* Reports Grid */}
                {reports.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                      <div key={report.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{report.title}</h3>
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                            VERIFIED
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                            {report.category.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        
                        {report.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{report.description}</p>
                        )}
                        
                        {report.address && (
                          <p className="text-gray-500 text-sm mb-3">📍 {report.address}</p>
                        )}
                        
                        {report.photoUrl && (
                          <img
                            src={`http://localhost:3001${report.photoUrl}`}
                            alt="Report"
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          <span>{new Date(report.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Verified Reports Yet</h3>
                    <p className="text-gray-500 mb-6">Reports need admin verification before appearing here.</p>
                  </div>
                )}
              </>
            ) : (
              /* Analytics Section */
              <div className="bg-white rounded-xl shadow-lg p-6">
                <CrimeAnalytics reports={reports} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}