"use client";

import { useState, useEffect, useRef } from 'react';
import { AppScreen } from '@/components/app-container';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface LandingScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    setIsLoaded(true);
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Try to play video immediately
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error('Initial video autoplay failed:', error);
          
          // Add click event listener as fallback
          const playOnInteraction = async () => {
            try {
              await video.play();
              document.removeEventListener('click', playOnInteraction);
            } catch (err) {
              console.error('Video playback failed after interaction:', err);
            }
          };
          
          document.addEventListener('click', playOnInteraction);
        }
      };
      
      playVideo();
      
      return () => {
        video.pause();
        video.src = '';
      };
    }
  }, []);

  const handleStart = () => {
    triggerHaptic('medium');
    onNavigate('intro');
  };

  return (
    <div 
      className="relative w-full h-screen cursor-pointer"
      onClick={handleStart}
    >
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          loop
          autoPlay
          preload="auto"
          poster="https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg"
        >
          <source 
            src="https://player.vimeo.com/external/477596246.hd.mp4?s=1c6152f3716a146ead43afd6dd4dfaec1f4cad85&profile_id=175"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>
    </div>
  );
}