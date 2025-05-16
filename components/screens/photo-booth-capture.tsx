"use client";

import { useState, useRef, useEffect } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, X } from 'lucide-react';

interface PhotoBoothCaptureProps {
  onNavigate: (screen: PhotoBoothScreen) => void;
}

export function PhotoBoothCapture({ onNavigate }: PhotoBoothCaptureProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { triggerHaptic } = useHapticFeedback();

  const initializeCamera = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      if (permissionStatus.state === 'denied') {
        throw new Error('Camera permission was denied. Please enable it in your browser settings.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setHasPermission(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Failed to access camera';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage = 'Camera permission was denied. Please enable it in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera device was found. Please connect a camera and try again.';
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Your camera is in use by another application. Please close other apps using the camera.';
        }
      }
      
      setError(errorMessage);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera not supported in this browser');
        setIsLoading(false);
        return;
      }

      await initializeCamera();
    };

    startCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCancel = () => {
    triggerHaptic('light');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onNavigate('welcome');
  };

  const handleTakePhoto = () => {
    triggerHaptic('medium');
    // Photo capture logic will be implemented in the next step
  };

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    await initializeCamera();
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-center">
          <p className="mb-2">Accessing camera...</p>
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !hasPermission) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-8">
            <img 
              src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
              alt="ONER"
              className="h-12 w-auto"
            />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Camera Access Required</h2>
            <p className="text-gray-600">
              {error || 'Please allow camera access to use the photo booth. Check your browser settings and make sure camera permissions are enabled.'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleRetry}
              className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800"
            >
              <Camera className="mr-2 h-5 w-5" />
              Retry Camera Access
            </Button>
            
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full h-14 border-gray-200 text-gray-900 hover:bg-gray-50"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover mirror"
      />

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>

      <div className="absolute inset-x-0 top-6 flex justify-between px-6">
        <Button
          onClick={handleCancel}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <Button
          onClick={handleTakePhoto}
          size="lg"
          className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100"
        >
          <Camera className="mr-2 h-5 w-5" />
          Take Photo
        </Button>
      </div>
    </div>
  );
}