"use client";

import { useState, useEffect, useRef } from 'react';
import { AppScreen } from '@/components/app-container';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';

interface IntroductionVideoProps {
  onNavigate: (screen: AppScreen) => void;
}

export function IntroductionVideo({ onNavigate }: IntroductionVideoProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { triggerHaptic } = useHapticFeedback();
  
  useEffect(() => {
    setIsLoaded(true);
    
    if (videoRef.current) {
      const video = videoRef.current;
      
      const updateProgress = () => {
        if (video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          setProgress(currentProgress);
        }
      };
      
      const handleEnded = () => {
        handleContinue();
      };
      
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('ended', handleEnded);
      
      // Auto-play video after a short delay
      const timer = setTimeout(() => {
        video.play().catch(error => {
          console.error('Video playback failed:', error);
        });
      }, 500);
      
      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('ended', handleEnded);
        clearTimeout(timer);
      };
    }
  }, []);
  
  const handleSkip = () => {
    triggerHaptic('light');
    onNavigate('name');
  };
  
  const handleContinue = () => {
    triggerHaptic('medium');
    onNavigate('name');
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          preload="auto"
          poster="https://images.pexels.com/photos/3965557/pexels-photo-3965557.jpeg"
          src="https://videos.pexels.com/video-files/7657449/7657449-hd_1920_1080_25fps.mp4"
        />
        
        <Button 
          onClick={handleSkip}
          variant="ghost" 
          size="icon" 
          className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/10 z-20"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Skip</span>
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <Progress 
            value={progress} 
            className="h-1.5 rounded-none [&>div]:bg-white [&>div]:transition-all [&>div]:duration-300 [&>div]:ease-linear bg-white/20 transition-all duration-300 ease-linear"
          />
        </div>
      </div>
    </div>
  );
}