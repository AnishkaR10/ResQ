'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, CheckCircle, XCircle, Clock, Trash2, Flag } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description?: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  photoUrl?: string;
  contactInfo?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('ALL');

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:3001/reports/admin/all');
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

  const updateReportStatus = async (reportId: string, status: 'PENDING' | 'VERIFIED' | 'REJECTED') => {
    try {
      await axios.patch(`http://localhost:3001/reports/admin/${reportId}/status`, { status });
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/reports/admin/${reportId}`);
      fetchReports(); // Refresh the list
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const filteredReports = reports.filter(report => 
    statusFilter === 'ALL' || report.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg text-gray-600">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-600">Manage and verify crime reports</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">
            {reports.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">
            {reports.filter(r => r.status === 'VERIFIED').length}
          </div>
          <div className="text-sm text-gray-600">Verified</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-red-600">
            {reports.filter(r => r.status === 'REJECTED').length}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['ALL', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reports found for the selected filter.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                    {getStatusBadge(report.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Category: {report.category.replace('_', ' ').toUpperCase()}
                  </p>
                  {report.description && (
                    <p className="text-gray-700 mb-3">{report.description}</p>
                  )}
                  {report.address && (
                    <p className="text-sm text-gray-600 mb-2">📍 {report.address}</p>
                  )}
                  {report.contactInfo && (
                    <p className="text-sm text-gray-600 mb-2">📞 {report.contactInfo}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>

                {report.photoUrl && (
                  <img
                    src={`http://localhost:3001${report.photoUrl}`}
                    alt="Report"
                    className="w-24 h-24 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                {report.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => updateReportStatus(report.id, 'VERIFIED')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verify
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'REJECTED')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                {report.status !== 'PENDING' && (
                  <button
                    onClick={() => updateReportStatus(report.id, 'PENDING')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    <Clock className="w-4 h-4" />
                    Mark Pending
                  </button>
                )}
                <button
                  onClick={() => deleteReport(report.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}