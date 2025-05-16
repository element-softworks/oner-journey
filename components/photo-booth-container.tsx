"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PhotoBoothLanding } from '@/components/screens/photo-booth-landing';
import { PhotoBoothWelcome } from '@/components/screens/photo-booth-welcome';
import { PhotoBoothCapture } from '@/components/screens/photo-booth-capture';

export type PhotoBoothScreen = 'landing' | 'welcome' | 'capture';

interface PhotoBoothContainerProps {
  initialScreen?: PhotoBoothScreen;
}

export function PhotoBoothContainer({ initialScreen = 'landing' }: PhotoBoothContainerProps) {
  const [currentScreen, setCurrentScreen] = useState<PhotoBoothScreen>(initialScreen);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigateToScreen = (screen: PhotoBoothScreen) => {
    setIsTransitioning(true);
    const path = getPathForScreen(screen);
    router.push(path);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 500);
  };

  const getPathForScreen = (screen: PhotoBoothScreen): string => {
    switch (screen) {
      case 'landing':
        return '/photo-booth/start';
      case 'welcome':
        return '/photo-booth/form';
      case 'capture':
        return '/photo-booth/capture';
      default:
        return '/photo-booth/start';
    }
  };

  return (
    <div className={`w-full h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {currentScreen === 'landing' && (
        <PhotoBoothLanding 
          onStart={() => navigateToScreen('welcome')}
          onBack={() => router.push('/')}
        />
      )}
      {currentScreen === 'welcome' && (
        <PhotoBoothWelcome
          onNavigate={navigateToScreen}
        />
      )}
      {currentScreen === 'capture' && (
        <PhotoBoothCapture
          onNavigate={navigateToScreen}
        />
      )}
    </div>
  );
}