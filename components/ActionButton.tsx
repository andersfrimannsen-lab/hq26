
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="relative flex items-center justify-center w-full max-w-xs px-8 py-4 mt-8 text-lg font-bold text-white bg-white/20 rounded-full backdrop-blur-sm shadow-lg hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50"
    >
      {isLoading ? <LoadingSpinner /> : 'Get a New Quote'}
    </button>
  );
};

export default ActionButton;
