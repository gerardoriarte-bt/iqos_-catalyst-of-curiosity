
import React from 'react';

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
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Catalyst of Curiosity</h1>
        <p className="text-gray-400 mt-1">An AI Ideation Engine for the 'Forever Curious' Campaign</p>
      </div>
       <div className="mt-4 sm:mt-0">
         <IQOSLogo />
       </div>
    </header>
  );
};

export default Header;
