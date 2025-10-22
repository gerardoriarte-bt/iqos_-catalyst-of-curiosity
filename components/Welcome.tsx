
import React from 'react';

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
      <div className="w-16 h-16 bg-teal-500/20 border-2 border-teal-500 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl text-teal-400 font-bold">?</span>
      </div>
      <h2 className="text-2xl font-bold text-white">Ready to Explore Uncertainty?</h2>
      <p className="mt-2 max-w-md text-slate-400">
        Use the briefing panel to select a brand trait and a curiosity trigger. The Catalyst of Curiosity will then generate unique marketing concepts that embody the 'Forever Curious' spirit.
      </p>
      <p className="mt-4 text-xs text-slate-500">
        Where all brands own the answers, IQOS will own the questions.
      </p>
    </div>
  );
};

export default Welcome;
