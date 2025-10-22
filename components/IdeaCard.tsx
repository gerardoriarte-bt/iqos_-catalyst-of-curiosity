import React from 'react';
import { Idea } from '../types';
import Loader from './Loader';

interface IdeaCardProps {
  idea: Idea;
  onGenerateImage: () => void;
}

const InfoBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h4 className="font-semibold text-teal-400 text-sm tracking-wider uppercase mb-1">{title}</h4>
    <p className="text-slate-300">{children}</p>
  </div>
);

const ImageGenerator: React.FC<{ idea: Idea, onGenerate: () => void }> = ({ idea, onGenerate }) => {
  if (idea.isImageLoading) {
    return (
      <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center p-4 border border-slate-700">
        <Loader title="Generating Visual..." description="" size="small" />
      </div>
    );
  }

  if (idea.imageError) {
    return (
      <div className="aspect-video bg-red-900/30 rounded-md flex flex-col items-center justify-center text-center p-4 border border-red-700">
        <p className="text-red-300 font-semibold">Image Generation Failed</p>
        <p className="text-xs text-red-400 mt-1 max-w-xs">{idea.imageError}</p>
        <button
          onClick={onGenerate}
          className="mt-3 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (idea.imageUrl) {
    return (
      <div className="aspect-video bg-black rounded-md overflow-hidden border border-slate-700">
        <img src={idea.imageUrl} alt={idea.ideaTitle} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-slate-800 rounded-md flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-slate-700 hover:border-teal-500 transition-colors">
        <h4 className="font-semibold text-white">Visualize This Concept</h4>
        <p className="text-sm text-slate-400 mt-1 mb-4 max-w-xs">
          Use AI to generate a unique visual based on the idea's prompt.
        </p>
        <button
          onClick={onGenerate}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Generate Visual
        </button>
    </div>
  )
}


const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onGenerateImage }) => {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:border-teal-500/50 hover:shadow-teal-500/10">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white pr-4">{idea.ideaTitle}</h3>
        <span className="bg-slate-700 text-teal-400 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
          {idea.executionFormat}
        </span>
      </div>
      
      <p className="text-slate-300 mb-6">{idea.conceptDescription}</p>

      <div className="mb-6">
        <ImageGenerator idea={idea} onGenerate={onGenerateImage} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-700 pt-4">
        <div className="space-y-4">
            <InfoBlock title="Curiosity Trigger">
                {idea.keyStrategicDrivers.curiosityTrigger}
            </InfoBlock>
            <InfoBlock title="Brand Trait">
                {idea.keyStrategicDrivers.brandTrait}
            </InfoBlock>
        </div>
        <div className="space-y-4">
            <InfoBlock title="LANU-29 Resonance">
                {idea.experienceExplorersResonance.appeal}
            </InfoBlock>
             <InfoBlock title="Activated Dimensions">
                {idea.experienceExplorersResonance.dimensions}
            </InfoBlock>
        </div>
      </div>
      
      <div className="mt-6 border-t border-slate-700 pt-4">
         <h4 className="font-semibold text-teal-400 text-sm tracking-wider uppercase mb-2">The Unresolved Question</h4>
         <p className="text-white italic text-lg">"{idea.whatIf}"</p>
      </div>

    </div>
  );
};

export default IdeaCard;