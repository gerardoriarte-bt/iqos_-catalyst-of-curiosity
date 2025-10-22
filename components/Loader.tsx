import React from 'react';

interface LoaderProps {
  title: string;
  description: string;
  size?: 'large' | 'small';
}

const Loader: React.FC<LoaderProps> = ({ title, description, size = 'large' }) => {
  const containerClasses = size === 'large'
    ? "flex flex-col items-center justify-center p-12 text-center bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg"
    : "flex flex-col items-center justify-center text-center w-full h-full";

  const svgClasses = size === 'large' ? "h-10 w-10" : "h-8 w-8";
  const titleClasses = size === 'large' ? "mt-4 text-lg font-semibold text-white" : "mt-3 text-sm font-semibold text-white";
  const descriptionClasses = size === 'large' ? "text-slate-400" : "text-slate-400 text-xs mt-1";

  return (
    <div className={containerClasses}>
      <svg className={`animate-spin text-teal-400 ${svgClasses}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className={titleClasses}>{title}</p>
      {description && <p className={descriptionClasses}>{description}</p>}
    </div>
  );
};

export default Loader;
