import React from 'react';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
);


const YoutubeCtaButton: React.FC = () => {
  return (
    <a
      href="https://www.youtube.com/@WriterAndersFrimann"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600/80 rounded-full backdrop-blur-sm shadow-lg hover:bg-red-500/90 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
      aria-label="Visit Anders Frimann's YouTube channel"
    >
      <YouTubeIcon className="w-5 h-5" />
      <span>Anders Frimann</span>
    </a>
  );
};

export default YoutubeCtaButton;
