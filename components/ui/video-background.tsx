"use client";

import { useState, useEffect, useRef } from 'react';

interface VideoBackgroundProps {
  src: string;
  poster: string;
}

export function VideoBackground({ src, poster }: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setIsLoaded(true);
        video.play().catch(error => {
          console.error('Video autoplay failed:', error);
        });
      };
      
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <>
      {/* Poster image (shows while video loads) */}
      <div 
        className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${poster})` }}
      ></div>
      
      {/* Actual video element */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload="auto"
      />
    </>
  );
}