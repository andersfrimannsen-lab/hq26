import React from 'react';

// New Sunflower Icon
const SunflowerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="#FBBF24" d="M21.94,10.65l-1.44-0.41c-0.34-0.1-0.6-0.36-0.7-0.7l-0.41-1.44c-0.24-0.85-1.29-1.2-2.14-0.96l-1.39,0.39c-0.33,0.1-0.69,0.03-0.96-0.24l-1.01-1.01c-0.63-0.63-1.71-0.63-2.34,0l-1.01,1.01c-0.27,0.27-0.63,0.33-0.96,0.24l-1.39-0.39c-0.85-0.24-1.9,0.11-2.14,0.96l-0.41,1.44c-0.1,0.34-0.36,0.6-0.7,0.7l-1.44,0.41c-0.85,0.24-1.2,1.29-0.96,2.14l0.39,1.39c0.1,0.33,0.03,0.69-0.24,0.96l-1.01,1.01c-0.63,0.63-0.63,1.71,0,2.34l1.01,1.01c0.27,0.27,0.33,0.63,0.24,0.96l-0.39,1.39c-0.24,0.85,0.11,1.9,0.96,2.14l1.44,0.41c0.34,0.1,0.6,0.36,0.7,0.7l0.41,1.44c0.24,0.85,1.29,1.2,2.14,0.96l1.39-0.39c0.33-0.1,0.69-0.03,0.96,0.24l1.01,1.01c0.63,0.63,1.71,0.63,2.34,0l1.01-1.01c0.27-0.27,0.63-0.33,0.96-0.24l1.39,0.39c0.85,0.24,1.9-0.11,2.14-0.96l0.41-1.44c0.1-0.34,0.36-0.6,0.7-0.7l1.44-0.41c0.85-0.24,1.2-1.29,0.96-2.14l-0.39-1.39c-0.1-0.33-0.03-0.69,0.24-0.96l1.01-1.01c0.63-0.63,0.63-1.71,0-2.34l-1.01-1.01c-0.27-0.27-0.33-0.63-0.24-0.96l0.39-1.39C22.18,11.94,22.79,10.89,21.94,10.65z"/>
        <path fill="#854D0E" d="M12,15a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z"/>
    </svg>
);


// New Heart Icon for Favorites Tab
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.185 15.185 0 01-2.071-1.32c-.676-.578-1.3-1.242-1.854-1.996a18.733 18.733 0 01-2.942-4.595c-.322-.92-.51-1.84-.51-2.735 0-3.418 2.59-6.183 5.824-6.183 1.631 0 3.09.815 4.073 2.064a5.617 5.617 0 014.073-2.064c3.234 0 5.824 2.765 5.824 6.183 0 .895-.188 1.815-.51 2.735a18.73 18.73 0 01-2.942 4.595c-.554.754-1.178 1.418-1.854 1.996a15.185 15.185 0 01-2.071 1.32 15.247 15.247 0 01-1.383.597l-.022.012-.007.003z" />
    </svg>
);

type View = 'main' | 'favorites';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
    const navItemClasses = "flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300";
    const activeClasses = "bg-white/20 text-white";
    const inactiveClasses = "text-white/70 hover:bg-white/10 hover:text-white";

    return (
        <header className="w-full max-w-3xl flex flex-col items-center py-6 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-white">
                <SunflowerIcon className="w-8 h-8" />
                <h1 className="text-3xl font-bold tracking-tight">Hopeful Quotes For Mental Health</h1>
            </div>
            <nav className="bg-black/20 p-2 rounded-full flex items-center gap-2">
                <button
                    onClick={() => onNavigate('main')}
                    className={`${navItemClasses} ${currentView === 'main' ? activeClasses : inactiveClasses}`}
                >
                    <SunflowerIcon className="w-5 h-5" />
                    <span>Home</span>
                </button>
                <button
                    onClick={() => onNavigate('favorites')}
                    className={`${navItemClasses} ${currentView === 'favorites' ? activeClasses : inactiveClasses}`}
                >
                    <HeartIcon className="w-5 h-5" />
                    <span>Favorites</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;