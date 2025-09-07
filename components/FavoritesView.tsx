import React from 'react';
import type { Quote } from '../types';

// SVG for a filled heart icon
const HeartIconFilled: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.185 15.185 0 01-2.071-1.32c-.676-.578-1.3-1.242-1.854-1.996a18.733 18.733 0 01-2.942-4.595c-.322-.92-.51-1.84-.51-2.735 0-3.418 2.59-6.183 5.824-6.183 1.631 0 3.09.815 4.073 2.064a5.617 5.617 0 014.073-2.064c3.234 0 5.824 2.765 5.824 6.183 0 .895-.188 1.815-.51 2.735a18.73 18.73 0 01-2.942 4.595c-.554.754-1.178 1.418-1.854 1.996a15.185 15.185 0 01-2.071 1.32 15.247 15.247 0 01-1.383.597l-.022.012-.007.003z" />
  </svg>
);


interface FavoritesViewProps {
  favorites: Quote[];
  onToggleFavorite: (quote: Quote) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onToggleFavorite }) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-lg text-white text-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">No Favorites Yet</h2>
        <p className="text-lg opacity-80">
          Click the heart icon on a quote to save it here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl animate-fade-in">
      <h2 className="text-3xl font-bold text-white text-center mb-6">Your Favorite Quotes</h2>
      <div className="space-y-4">
        {favorites.map((favQuote) => (
          <div
            key={favQuote.quote}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 w-full text-white flex items-start gap-4"
          >
            <div className="flex-grow">
              <p className="text-xl font-medium leading-relaxed">
                “{favQuote.quote}”
              </p>
              <footer className="mt-4 text-md font-semibold opacity-80">
                — {favQuote.author}
              </footer>
            </div>
            <button
              onClick={() => onToggleFavorite(favQuote)}
              className="text-red-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
              aria-label="Remove from favorites"
            >
              <HeartIconFilled className="w-7 h-7" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesView;
