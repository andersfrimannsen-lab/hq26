import React from 'react';
import { playlist as playlistData } from '../music';

interface Track {
    url: string;
    title: string;
}

// SVG Icons
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-6-13.5v13.5" />
    </svg>
);

const SkipBackIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 19.5l-7.5-7.5 7.5-7.5" />
    </svg>
);

const SkipIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const VolumeUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const VolumeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);

const AudioPlayer: React.FC = () => {
    const audioRef = React.useRef<HTMLAudioElement>(null);
    const [playlist] = React.useState<Track[]>(playlistData || []);
    const [currentTrackIndex, setCurrentTrackIndex] = React.useState(() =>
        Math.floor(Math.random() * playlistData.length)
    );
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [volume, setVolume] = React.useState(0.1); // Start with very low volume
    const [showSlider, setShowSlider] = React.useState(false);

    // Effect to control audio playback (play/pause) based on state
    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(error => {
                console.error("Audio play failed:", error);
                setIsPlaying(false); // Reset state if play fails for any reason
            });
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTrackIndex]); // Re-run when song changes or play state toggles

    // Effect to control volume and mute state
    React.useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = volume;
            audio.muted = isMuted;
        }
    }, [volume, isMuted, currentTrackIndex]); // Re-run when song changes to apply volume
    
    // Effect for persistent service worker notification
    React.useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            return;
        }

        const postMessageToSw = (message: { type: string }) => {
            navigator.serviceWorker.ready.then((registration) => {
                if (registration.active) {
                    registration.active.postMessage(message);
                }
            }).catch(error => {
                console.error('Failed to send message to service worker:', error);
            });
        };

        if (isPlaying) {
            postMessageToSw({ type: 'SHOW_PLAYER_NOTIFICATION' });
        } else {
            postMessageToSw({ type: 'HIDE_PLAYER_NOTIFICATION' });
        }
    }, [isPlaying]);

    const togglePlayPause = () => {
        setIsPlaying(prev => !prev);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(prevMuted => !prevMuted);
    };

    const handleTrackEnd = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };
    
    const handleSkipBack = React.useCallback(() => {
        if (playlist.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
            setIsPlaying(true);
        }
    }, [playlist.length]);

    const handleSkip = React.useCallback(() => {
        if (playlist.length > 0) {
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % playlist.length);
            setIsPlaying(true);
        }
    }, [playlist.length]);

    // Enhanced Media Session API for background playback control and notification integration
    React.useEffect(() => {
        if (!('mediaSession' in navigator) || playlist.length === 0) {
            return;
        }

        const track = playlist[currentTrackIndex];
        if (!track) return;

        try {
            // Set metadata for the current track
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: 'Hopeful Quotes',
                album: 'Relaxing Music',
                artwork: [
                    { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
                ]
            });
            
            // Set playback state
            navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
            
            // Clear existing handlers to avoid conflicts
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            
            // Set new handlers
            navigator.mediaSession.setActionHandler('play', () => {
                console.log('Media session play action');
                setIsPlaying(true);
            });
            
            navigator.mediaSession.setActionHandler('pause', () => {
                console.log('Media session pause action');
                setIsPlaying(false);
            });
            
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                console.log('Media session previous track action');
                handleSkipBack();
            });
            
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                console.log('Media session next track action');
                handleSkip();
            });

            console.log('Media session updated for track:', track.title);
        } catch (error) {
            console.error('Error setting up media session:', error);
        }

    }, [currentTrackIndex, isPlaying, playlist, handleSkip, handleSkipBack]);

    // Handle audio events for better integration
    React.useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => {
            console.log('Audio started playing');
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = "playing";
            }
        };

        const handlePause = () => {
            console.log('Audio paused');
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = "paused";
            }
        };

        const handleLoadStart = () => {
            console.log('Audio loading started');
        };

        const handleCanPlay = () => {
            console.log('Audio can play');
        };

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('canplay', handleCanPlay);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentTrackIndex]);

    if (playlist.length === 0) {
        return null; // Don't render the player if there's no music
    }

    const buttonClasses = "p-2 text-white bg-black/30 rounded-full backdrop-blur-sm shadow-lg hover:bg-black/50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/50";

    return (
        <div 
            className="flex items-center gap-2 group"
            onMouseEnter={() => setShowSlider(true)}
            onMouseLeave={() => setShowSlider(false)}
        >
            <audio
                ref={audioRef}
                src={playlist[currentTrackIndex]?.url}
                onEnded={handleTrackEnd}
                loop={false}
                key={currentTrackIndex}
                preload="metadata"
            />
            
            <button onClick={handleSkipBack} className={buttonClasses} aria-label="Skip to previous track">
                <SkipBackIcon className="w-6 h-6" />
            </button>

            <button onClick={togglePlayPause} className={buttonClasses} aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            
            <button onClick={handleSkip} className={buttonClasses} aria-label="Skip to next track">
                <SkipIcon className="w-6 h-6" />
            </button>

            <button onClick={toggleMute} className={buttonClasses} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? (
                    <VolumeOffIcon className="w-6 h-6" />
                ) : (
                    <VolumeUpIcon className="w-6 h-6" />
                )}
            </button>
            <div className={`transition-all duration-300 ease-in-out ${showSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'} overflow-hidden`}>
                 <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    aria-label="Volume slider"
                />
            </div>
        </div>
    );
};

export default AudioPlayer;

