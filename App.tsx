import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import QuoteCard from './components/QuoteCard';
import ActionButton from './components/ActionButton';
import FavoritesView from './components/FavoritesView';
import YoutubeCtaButton from './components/YoutubeCtaButton';
import ShopBooksButton from './components/ShopBooksButton';
import AudioPlayer from './components/AudioPlayer';
import GoToMainViewButton from './components/GoToMainViewButton';
import { generateHopefulQuote } from './services/geminiService';
import { loadFavorites, saveFavorites } from './services/favoriteService';
import type { Quote } from './types';

type View = 'main' | 'favorites';

const App: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [view, setView] = useState<View>('main');

  // Read view from URL on initial load for PWA shortcuts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'favorites') {
      setView('favorites');
      // Clean up the URL to avoid confusion
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (quote) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait for fade-out
    }

    try {
      // The service now handles getting a new, different quote.
      const nextQuote = await generateHopefulQuote(quote ?? undefined);
      setQuote(nextQuote);
    } catch (err) {
      setError("Failed to fetch a new quote. Please try again.");
      console.error(err);
    } finally {
      setIsAnimating(false);
      setIsLoading(false);
    }
  }, [quote]);

  // Initial quote fetch
  useEffect(() => {
    const initialFetch = async () => {
        setIsLoading(true);
        try {
            const initialQuote = await generateHopefulQuote();
            setQuote(initialQuote);
        } catch (err) {
            setError("Failed to fetch an initial quote. Please check your connection.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    initialFetch();
  }, []);

  const toggleFavorite = (quoteToToggle: Quote) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(
        fav => fav.quote === quoteToToggle.quote
      );
      if (isAlreadyFavorite) {
        return prevFavorites.filter(fav => fav.quote !== quoteToToggle.quote);
      } else {
        return [...prevFavorites, quoteToToggle];
      }
    });
  };

  const isCurrentQuoteFavorite = quote
    ? favorites.some(fav => fav.quote === quote.quote)
    : false;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-purple-500 via-purple-700 to-indigo-800 flex flex-col items-center p-4 sm:p-6 pb-24 overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

      <Header currentView={view} onNavigate={setView} />

      <main className="flex-grow flex flex-col items-center justify-center w-full z-10 px-4">
        {view === 'main' && (
          <ActionButton onClick={fetchQuote} isLoading={isLoading} />
        )}

        <div className={`${view === 'main' ? 'mt-8 mb-6' : 'my-6'} flex flex-col items-center justify-center gap-4 w-full`}>
            <YoutubeCtaButton />
            <ShopBooksButton />
        </div>

        {view === 'main' ? (
          <>
            {error && <p className="text-red-400 mb-4 animate-fade-in">{error}</p>}
            
            {quote && (
              <QuoteCard
                quoteData={quote}
                isFadingOut={isAnimating}
                isFavorite={isCurrentQuoteFavorite}
                onToggleFavorite={() => toggleFavorite(quote)}
              />
            )}
          </>
        ) : (
          <FavoritesView favorites={favorites} onToggleFavorite={toggleFavorite} />
        )}
      </main>
      
      <div className="fixed bottom-4 right-4 z-20 flex items-end gap-2">
        <AudioPlayer />
        <GoToMainViewButton currentView={view} onNavigate={setView} />
      </div>

    </div>
  );
};

export default App;