import React from 'react';

const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);


const ShopBooksButton: React.FC = () => {
  return (
    <a
      href="https://andersfrimannschizophrenia.com"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-purple-600/80 rounded-full backdrop-blur-sm shadow-lg hover:bg-purple-500/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Shop books by Anders Frimann"
    >
      <BookIcon className="w-5 h-5" />
      <span>Shop Books</span>
    </a>
  );
};

export default ShopBooksButton;