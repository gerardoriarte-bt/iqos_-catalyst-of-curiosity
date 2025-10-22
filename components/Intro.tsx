import React, { useEffect, useState } from 'react';

const IQOSLogo = () => (
    <div 
        className="backdrop-blur-sm rounded-lg p-4 border shadow-lg"
        style={{ 
            backgroundColor: 'rgba(0, 209, 210, 0.15)',
            borderColor: 'rgba(0, 209, 210, 0.3)',
            boxShadow: '0 10px 25px rgba(0, 209, 210, 0.1)'
        }}
    >
        <img 
            src="/IQOS_logo_nbw.png" 
            alt="IQOS Logo" 
            className="h-12 w-auto"
            style={{ maxHeight: '48px' }}
        />
    </div>
);


interface IntroProps {
  onAnimationEnd: () => void;
}

const Intro: React.FC<IntroProps> = ({ onAnimationEnd }) => {
  const [phase, setPhase] = useState(0); // 0: initial, 1: logo visible, 2: text visible, 3: fading out

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),       // show logo
      setTimeout(() => setPhase(2), 1000),      // show text
      setTimeout(() => setPhase(3), 3000),      // start fade out
      setTimeout(() => onAnimationEnd(), 3800) // finish
    ];
    return () => timers.forEach(clearTimeout);
  }, [onAnimationEnd]);
  
  const containerClasses = `fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-700 ease-in-out ${phase === 3 ? 'opacity-0' : 'opacity-100'}`;
  
  return (
    <div className={containerClasses}>
      <div className={`transition-all duration-1000 ease-out ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <IQOSLogo />
      </div>
      <div className={`mt-4 transition-all duration-1000 ease-out delay-300 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-3xl font-bold text-white tracking-tight">Catalyst of Curiosity</h1>
        <div 
          className="h-0.5 w-full bg-teal-400 mt-2 mx-auto transition-transform duration-1000 ease-out delay-500" 
          style={{ 
            transform: phase >= 2 ? 'scaleX(1)' : 'scaleX(0)', 
            transformOrigin: 'center' 
          }} 
        />
      </div>
    </div>
  );
};

export default Intro;