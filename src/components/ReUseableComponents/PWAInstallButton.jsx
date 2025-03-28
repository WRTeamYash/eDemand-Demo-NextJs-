'use client';

import { useState, useEffect } from 'react';

/**
 * PWA Install Button Component
 * Shows an install button when the PWA is installable but not yet installed
 * Only displays on mobile devices (iOS, Android) when NEXT_PUBLIC_ENABLE_PWA is true
 */
export default function PWAInstallButton() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isPwaEnabled, setIsPwaEnabled] = useState(false);

  useEffect(() => {
    // Check if PWA feature is enabled via env variable
    const pwaEnabled = process.env.NEXT_PUBLIC_PWA_ENABLED === 'true';
    setIsPwaEnabled(pwaEnabled);
    
    // If PWA is not enabled, don't continue
    if (!pwaEnabled) return;

    if (typeof window === 'undefined') return;

    // Browser detection
    const userAgent = navigator.userAgent;
    // Check for iOS device
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if user is on Safari (required for iOS PWA installation)
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);

    // Check if the device is mobile (Android or iOS)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
    setIsMobileDevice(isMobile);

    // Check if the app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return true;
      }

      // Also check for window-controls-overlay mode (Windows PWA)
      if (window.matchMedia('(display-mode: window-controls-overlay)').matches) {
        setIsInstalled(true);
        return true;
      }

      return false;
    };

    checkInstalled();

    // Listen for the beforeinstallprompt event (not supported on iOS)
    const handleBeforeInstallPrompt = (e) => {
      // Only store the event if it's a mobile device
      if (isMobile) {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Store the event for later use
        setInstallPrompt(e);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    // Check installability
    const checkInstallability = () => {
      let info = 'Checking installability criteria:\n';

      // Check PWA criteria
      if (!window.navigator.serviceWorker) {
        info += '❌ Service Worker is not supported in this browser\n';
      } else {
        info += '✅ Service Worker is supported\n';
      }

      // Check if running in HTTPS
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        info += '❌ Not running in HTTPS (required for PWA installation)\n';
      } else {
        info += '✅ Running in HTTPS\n';
      }

      // Check if it's a mobile device
      if (!isMobile) {
        info += '❌ Not a mobile device (install button hidden on desktop)\n';
      } else {
        info += '✅ Is a mobile device\n';
      }

    };

    checkInstallability();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', () => setIsInstalled(true));
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS installation guide
      setShowIOSGuide(true);
    } else if (installPrompt) {
      // Show the install prompt for non-iOS devices
      const promptEvent = installPrompt;
      promptEvent.prompt();

      // Wait for the user to respond to the prompt
      await promptEvent.userChoice;

      // Clear the saved prompt since it can't be used again
      setInstallPrompt(null);
    } else {
      alert(
        'Installation prompt not available. Please try again later or check if the app is already installed.'
      );
    }
  };

  // Don't render anything if:
  // 1. PWA is not enabled via env variable
  // 2. The app is already installed
  // 3. It's not a mobile device
  if (!isPwaEnabled || isInstalled || !isMobileDevice) {
    return null;
  }

  // Show install button only for mobile devices:
  // 1. iOS devices always (they don't support beforeinstallprompt)
  // 2. Android devices when installPrompt is available
  const shouldShowInstallButton = isIOS || (isMobileDevice && installPrompt);
  if (shouldShowInstallButton) {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-md primary_bg_color px-4 py-2 text-white shadow-lg"
          aria-label={`Install ${process.env.NEXT_PUBLIC_APP_NAME || 'eDemand'}`}
        >
          <span>{isIOS ? 'Add to Home Screen' : `Install ${process.env.NEXT_PUBLIC_APP_NAME || 'eDemand'}`}</span>
        </button>

        
       

        {/* iOS Installation Guide Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-md rounded-lg bg-white text-black p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-bold">Install on iOS</h3>
              <p className="mb-4">To install this app on your iOS device:</p>
              <ol className="mb-4 ml-5 list-decimal space-y-2">
                <li>Tap the Share button at the bottom of the screen</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
              {!isSafari && (
                <p className="mb-4 text-red-500">
                  ⚠️ You need to use Safari browser to install this app on iOS.
                </p>
              )}
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-md primary_bg_color py-2 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
} 