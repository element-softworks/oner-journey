"use client";

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';

interface PhotoBoothDetailsProps {
  onNavigate: (screen: PhotoBoothScreen) => void;
}

export function PhotoBoothDetails({ onNavigate }: PhotoBoothDetailsProps) {


  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-center mb-8">
          <img 
            src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
            alt="ONER"
            className="h-12 w-auto"
          />
        </div>

        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Use your phone to enter your details</h1>
          </div>

          <Button 
            onClick={() => onNavigate('capture')}
            className="w-full h-14 mt-8 bg-gray-900 text-white hover:bg-gray-800 group"
          >
            <span className="text-lg font-semibold">Continue</span>
          </Button>
        </div>
      </div>
    </div>
  );
}