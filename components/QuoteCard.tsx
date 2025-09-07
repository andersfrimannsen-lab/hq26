import React from 'react';
import type { Quote } from '../types';

// SVG for heart icons
const HeartIconOutline: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const HeartIconFilled: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.185 15.185 0 01-2.071-1.32c-.676-.578-1.3-1.242-1.854-1.996a18.733 18.733 0 01-2.942-4.595c-.322-.92-.51-1.84-.51-2.735 0-3.418 2.59-6.183 5.824-6.183 1.631 0 3.09.815 4.073 2.064a5.617 5.617 0 014.073-2.064c3.234 0 5.824 2.765 5.824 6.183 0 .895-.188 1.815-.51 2.735a18.73 18.73 0 01-2.942 4.595c-.554.754-1.178 1.418-1.854 1.996a15.185 15.185 0 01-2.071 1.32 15.247 15.247 0 01-1.383.597l-.022.012-.007.003z" />
    </svg>
);


interface QuoteCardProps {
  quoteData: Quote;
  isFadingOut: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quoteData, isFadingOut, isFavorite, onToggleFavorite }) => {
  return (
    <div
      key={quoteData.quote}
      className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-lg text-white relative ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}
    >
      <button
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors duration-300"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <HeartIconFilled className="w-8 h-8 text-red-400" /> : <HeartIconOutline className="w-8 h-8" />}
      </button>

      <blockquote className="text-center">
        <p className="text-2xl lg:text-3xl font-medium leading-relaxed pr-8">
          “{quoteData.quote}”
        </p>
        <footer className="mt-6 text-lg font-semibold opacity-80">
          — {quoteData.author}
        </footer>
      </blockquote>
    </div>
  );
};

export default QuoteCard;
