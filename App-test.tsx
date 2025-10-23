import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#14b8a6' }}>
          IQOS Catalyst of Curiosity
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#94a3b8' }}>
          Login System Test
        </p>
        <div style={{ 
          backgroundColor: '#1e293b', 
          padding: '2rem', 
          borderRadius: '0.5rem',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#14b8a6' }}>Demo Credentials:</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Admin:</strong> admin / SecureAdmin2024!
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>User:</strong> marketing / MarketingPro2024!
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Login system is working! Ready to implement full authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

