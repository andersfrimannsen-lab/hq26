import React from 'react';

// Using the same sunflower icon as Header for consistency
const SunflowerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="#FBBF24" d="M21.94,10.65l-1.44-0.41c-0.34-0.1-0.6-0.36-0.7-0.7l-0.41-1.44c-0.24-0.85-1.29-1.2-2.14-0.96l-1.39,0.39c-0.33,0.1-0.69,0.03-0.96-0.24l-1.01-1.01c-0.63-0.63-1.71-0.63-2.34,0l-1.01,1.01c-0.27,0.27-0.63,0.33-0.96,0.24l-1.39-0.39c-0.85-0.24-1.9,0.11-2.14,0.96l-0.41,1.44c-0.1,0.34-0.36,0.6-0.7,0.7l-1.44,0.41c-0.85,0.24-1.2,1.29-0.96,2.14l0.39,1.39c0.1,0.33,0.03,0.69-0.24,0.96l-1.01,1.01c-0.63-0.63-0.63,1.71,0,2.34l1.01,1.01c0.27,0.27,0.33,0.63,0.24,0.96l-0.39,1.39c-0.24,0.85,0.11,1.9,0.96,2.14l1.44,0.41c0.34,0.1,0.6,0.36,0.7,0.7l0.41,1.44c0.24,0.85,1.29,1.2,2.14,0.96l1.39-0.39c0.33-0.1,0.69-0.03,0.96,0.24l1.01,1.01c0.63,0.63,1.71,0.63,2.34,0l1.01-1.01c0.27,0.27,0.63-0.33,0.96-0.24l1.39,0.39c0.85,0.24,1.9-0.11,2.14-0.96l0.41-1.44c0.1-0.34,0.36-0.6,0.7-0.7l1.44-0.41c0.85-0.24,1.2-1.29,0.96-2.14l-0.39-1.39c-0.1-0.33-0.03-0.69,0.24-0.96l1.01-1.01c0.63-0.63,0.63-1.71,0-2.34l-1.01-1.01c-0.27-0.27-0.33-0.63-0.24-0.96l0.39-1.39C22.18,11.94,22.79,10.89,21.94,10.65z"/>
        <path fill="#854D0E" d="M12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/>
    </svg>
);


interface GoToMainViewButtonProps {
    currentView: 'main' | 'favorites';
    onNavigate: (view: 'main') => void;
}

const GoToMainViewButton: React.FC<GoToMainViewButtonProps> = ({ currentView, onNavigate }) => {

    // This button should only be visible on mobile when not on the main view.
    if (currentView === 'main') {
        return null;
    }
    
    return (
        <div className="md:hidden">
            <button
                onClick={() => onNavigate('main')}
                className="p-2.5 text-white bg-black/30 rounded-full backdrop-blur-sm shadow-lg hover:bg-black/50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50 animate-fade-in"
                aria-label="Go to main app view"
                title="Go to Home"
            >
                <SunflowerIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default GoToMainViewButton;