import React, { useState, useEffect } from 'react';
import { Brief } from '../types';
import { PRIMARY_TAKEAWAYS, CURIOSITY_TRIGGERS, IQOS_COUNTRIES, COUNTRY_SUGGESTIONS } from '../constants';

interface BriefFormProps {
  onGenerate: (brief: Brief) => void;
  isLoading: boolean;
}

const BriefForm: React.FC<BriefFormProps> = ({ onGenerate, isLoading }) => {
  const [brief, setBrief] = useState<Brief>({
    primaryTakeaway: PRIMARY_TAKEAWAYS[0],
    curiosityTrigger: CURIOSITY_TRIGGERS[0],
    country: IQOS_COUNTRIES[0],
  });
  const [takeawaySuggestion, setTakeawaySuggestion] = useState<string | null>(null);
  const [triggerSuggestion, setTriggerSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const suggestions = COUNTRY_SUGGESTIONS[brief.country];

    // Handle takeaway suggestions
    const showTakeawaySuggestion = suggestions && !suggestions.takeaways.includes(brief.primaryTakeaway);
    if (showTakeawaySuggestion) {
      setTakeawaySuggestion(`For ${brief.country}, consider takeaways like '${suggestions.takeaways.join("' or '")}' to better align with cultural nuances.`);
    } else {
      setTakeawaySuggestion(null);
    }

    // Handle trigger suggestions (as per the request)
    const showTriggerSuggestion = suggestions && !suggestions.triggers.includes(brief.curiosityTrigger);
    if (showTriggerSuggestion) {
      setTriggerSuggestion(`In ${brief.country}, triggers like '${suggestions.triggers.join("' or '")}' often resonate more strongly.`);
    } else {
      setTriggerSuggestion(null);
    }
  }, [brief.country, brief.primaryTakeaway, brief.curiosityTrigger]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(brief);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrief(prev => ({ ...prev, [name]: value }));
  };

  const selectStyles = "w-full bg-slate-800 border border-slate-600 rounded-md p-3 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition duration-200 text-white";

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 sticky top-8">
      <h2 className="text-xl font-bold text-teal-400 mb-1">Briefing</h2>
      <p className="text-slate-400 mb-6 text-sm">Select the strategic drivers to spark an idea.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
            Target Country
          </label>
          <select
            id="country"
            name="country"
            value={brief.country}
            onChange={handleSelectChange}
            className={selectStyles}
            disabled={isLoading}
          >
            {IQOS_COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="primaryTakeaway" className="block text-sm font-medium text-slate-300 mb-2">
            Primary Takeaway
          </label>
          <select
            id="primaryTakeaway"
            name="primaryTakeaway"
            value={brief.primaryTakeaway}
            onChange={handleSelectChange}
            className={selectStyles}
            disabled={isLoading}
          >
            {PRIMARY_TAKEAWAYS.map(takeaway => (
              <option key={takeaway} value={takeaway}>{takeaway}</option>
            ))}
          </select>
           {takeawaySuggestion && (
            <p className="text-xs text-slate-400 mt-2 px-1 animate-pulse">
              <strong>Suggestion:</strong> {takeawaySuggestion}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="curiosityTrigger" className="block text-sm font-medium text-slate-300 mb-2">
            Curiosity Trigger
          </label>
          <select
            id="curiosityTrigger"
            name="curiosityTrigger"
            value={brief.curiosityTrigger}
            onChange={handleSelectChange}
            className={selectStyles}
            disabled={isLoading}
          >
            {CURIOSITY_TRIGGERS.map(trigger => (
              <option key={trigger} value={trigger}>{trigger}</option>
            ))}
          </select>
           {triggerSuggestion && (
            <p className="text-xs text-slate-400 mt-2 px-1 animate-pulse">
              <strong>Suggestion:</strong> {triggerSuggestion}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out flex items-center justify-center"
        >
          {isLoading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : 'Ignite Ideas'}
        </button>
      </form>
    </div>
  );
};

export default BriefForm;