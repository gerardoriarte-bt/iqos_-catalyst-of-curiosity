import React, { useState } from 'react';

const SimpleLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check
    if (
      (credentials.username === 'admin' && credentials.password === 'SecureAdmin2024!') ||
      (credentials.username === 'marketing' && credentials.password === 'MarketingPro2024!')
    ) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-teal-400">IQOS Catalyst of Curiosity</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
          <div className="bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Welcome, {credentials.username}!</h2>
            <p className="text-slate-300 mb-6">
              You are now logged in to the IQOS Catalyst of Curiosity application.
            </p>
            <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">Demo Credentials:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Admin:</strong> admin / SecureAdmin2024!</li>
                <li><strong>User:</strong> marketing / MarketingPro2024!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">IQOS Catalyst</h1>
          <p className="text-slate-400">Sign in to access the Curiosity Engine</p>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Demo Credentials:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Admin:</span>
                <span className="text-teal-400">admin / SecureAdmin2024!</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">User:</span>
                <span className="text-teal-400">marketing / MarketingPro2024!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;

