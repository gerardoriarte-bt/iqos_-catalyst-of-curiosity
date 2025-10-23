
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const IQOSLogo = () => (
  <div 
    className="backdrop-blur-sm rounded-lg p-2 border shadow-md"
    style={{ 
      backgroundColor: 'rgba(0, 209, 210, 0.15)',
      borderColor: 'rgba(0, 209, 210, 0.3)',
      boxShadow: '0 8px 20px rgba(0, 209, 210, 0.1)'
    }}
  >
    <img 
      src="/IQOS_logo_nbw.png" 
      alt="IQOS Logo" 
      className="h-9 w-auto"
      style={{ maxHeight: '36px' }}
    />
  </div>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Catalyst of Curiosity</h1>
        <p className="text-gray-400 mt-1">An AI Ideation Engine for the 'Forever Curious' Campaign</p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-white font-medium">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Logout"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
        
        <IQOSLogo />
      </div>
    </header>
  );
};

export default Header;
