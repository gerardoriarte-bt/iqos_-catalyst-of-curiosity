import React, { useState, useCallback } from 'react';
import { Brief, Idea } from './types';
import { generateMarketingIdeas, generateImage } from './services/geminiService';
import BriefForm from './components/BriefForm';
import Header from './components/Header';
import Loader from './components/Loader';
import IdeaCard from './components/IdeaCard';
import ErrorMessage from './components/ErrorMessage';
import Welcome from './components/Welcome';
import Intro from './components/Intro';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdeas, setGeneratedIdeas] = useState<Idea[]>([]);

  const handleGenerate = useCallback(async (brief: Brief) => {
    setIsLoading(true);
    setError(null);
    setGeneratedIdeas([]);
    try {
      const ideas = await generateMarketingIdeas(brief);
      setGeneratedIdeas(ideas);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate ideas: ${err.message}. Please try again.`);
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async (ideaIndex: number) => {
    const idea = generatedIdeas[ideaIndex];
    if (!idea || !idea.visualPrompt) return;

    // Set loading state for the specific idea
    setGeneratedIdeas(currentIdeas =>
      currentIdeas.map((item, index) =>
        index === ideaIndex ? { ...item, isImageLoading: true, imageError: undefined } : item
      )
    );

    try {
      const imageUrl = await generateImage(idea.visualPrompt);
      // Set image URL on success
      setGeneratedIdeas(currentIdeas =>
        currentIdeas.map((item, index) =>
          index === ideaIndex ? { ...item, isImageLoading: false, imageUrl } : item
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown image generation error.';
      // Set error message on failure
      setGeneratedIdeas(currentIdeas =>
        currentIdeas.map((item, index) =>
          index === ideaIndex ? { ...item, isImageLoading: false, imageError: errorMessage } : item
        )
      );
    }
  }, [generatedIdeas]);

  if (showIntro) {
    return <Intro onAnimationEnd={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-8 selection:bg-teal-500 selection:text-white animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <BriefForm onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            {isLoading && <Loader title="Igniting Curiosity..." description="The AI is exploring the unknown. Please wait." />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && generatedIdeas.length === 0 && <Welcome />}
            {generatedIdeas.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-teal-400 border-b-2 border-teal-400/30 pb-2">
                  Generated Concepts
                </h2>
                {generatedIdeas.map((idea, index) => (
                  <IdeaCard
                    key={index}
                    idea={idea}
                    onGenerateImage={() => handleGenerateImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;