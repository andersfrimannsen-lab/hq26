import React, { useState, useEffect } from 'react';

const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const BellAlertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M12 18.75a.75.75 0 00.75-.75v-1.5a.75.75 0 00-1.5 0v1.5c0 .414.336.75.75.75zM12 4.5a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V5.25A.75.75 0 0112 4.5z" />
    </svg>
);

const BellSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);



const NotificationBell: React.FC = () => {
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        // Use the Permissions API for robust state tracking
        if ('Notification' in window && 'permissions' in navigator) {
            navigator.permissions.query({ name: 'notifications' }).then((permissionStatus) => {
                // Fix: The Permissions API uses 'prompt' which is equivalent to 'default' in the Notification API. Map 'prompt' to 'default' to align with the NotificationPermission type.
                setPermission(permissionStatus.state === 'prompt' ? 'default' : permissionStatus.state);
                // Listen for changes in permission status
                permissionStatus.onchange = () => {
                    // Fix: The Permissions API uses 'prompt' which is equivalent to 'default' in the Notification API. Map 'prompt' to 'default' to align with the NotificationPermission type.
                    setPermission(permissionStatus.state === 'prompt' ? 'default' : permissionStatus.state);
                };
            });
        } else if ('Notification' in window) {
            // Fallback for older browsers
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator)) {
            alert('This browser does not support notifications.');
            return;
        }

        // This will only prompt if the permission is 'default'
        const result = await Notification.requestPermission();
        setPermission(result);

        if (result === 'granted') {
            navigator.serviceWorker.ready.then((registration) => {
                // Show immediate welcome notification for user feedback
                registration.active?.postMessage({ type: 'SHOW_WELCOME_NOTIFICATION' });
                // Start the daily scheduling loop in the service worker
                registration.active?.postMessage({ type: 'START_DAILY_SCHEDULE' });
            });
        }
    };

    const handleDeniedPermission = () => {
        alert(
            "Notifications are currently blocked.\n\n" +
            "To enable them, please go to your browser's site settings for this page and change the permission from 'Block' to 'Allow' or 'Ask'.\n\n" +
            "You may need to reload the page after changing the setting for it to take effect."
        );
    };


    const buttonClasses = "p-2 rounded-full transition-colors duration-300";
    const activeClasses = "bg-white/20 text-white";
    const inactiveClasses = "text-white/70 hover:bg-white/10 hover:text-white";
    
    if (permission === 'granted') {
        return (
            <button
                disabled
                className={`${buttonClasses} ${activeClasses} opacity-70 cursor-default`}
                aria-label="Notifications are enabled"
                title="Notifications are enabled"
            >
                <BellIcon className="w-5 h-5" />
            </button>
        );
    }
    
    if (permission === 'denied') {
        return (
            <button
                onClick={handleDeniedPermission}
                className={`${buttonClasses} ${inactiveClasses} opacity-50`}
                aria-label="Notifications are blocked. Click for instructions."
                title="Notifications are blocked. Click for instructions to re-enable."
            >
                <BellSlashIcon className="w-5 h-5" />
            </button>
        );
    }

    return (
        <button
            onClick={requestPermission}
            className={`${buttonClasses} ${inactiveClasses}`}
            aria-label="Enable notifications"
            title="Enable notifications"
        >
            <BellAlertIcon className="w-5 h-5" />
        </button>
    );
};

export default NotificationBell;
