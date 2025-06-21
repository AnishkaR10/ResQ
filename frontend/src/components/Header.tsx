'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';
import { Shield, LogOut, User, Settings } from 'lucide-react';

interface HeaderProps {
  activeTab: 'map' | 'analytics' | 'admin';
  setActiveTab: (tab: 'map' | 'analytics' | 'admin') => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">ResQ</h1>
              <p className="text-lg text-gray-600 mt-2">Report and track incidents in your community</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'map'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map View
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </button>
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'admin'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </button>
                )}
              </div>

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{user.email}</span>
                    {user.role === 'ADMIN' && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}