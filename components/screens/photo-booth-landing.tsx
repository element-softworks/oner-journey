"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ArrowLeft } from 'lucide-react';

interface PhotoBoothLandingProps {
  onStart: () => void;
  onBack: () => void;
}

export function PhotoBoothLanding({ onStart, onBack }: PhotoBoothLandingProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  useEffect(() => {
    setIsLoaded(true);
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.error('Initial video autoplay failed:', error);
          
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
    onStart();
  };

  const handleBack = () => {
    triggerHaptic('light');
    onBack();
  };

  return (
    <div className="relative w-full h-screen">
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          loop
          autoPlay
          preload="auto"
          poster="https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg"
        >
          <source 
            src="https://i.imgur.com/NAPXMiL.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="icon"
            className="self-start text-white hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back</span>
          </Button>
          
          <Button
            onClick={handleStart}
            className="w-full max-w-md h-14 bg-white text-gray-900 hover:bg-gray-100"
          >
            Start Photo Booth Experience
          </Button>
        </div>
      </div>
    </div>
  );
}