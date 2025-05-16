"use client";

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useUser } from '@/context/user-context';
import { ArrowRight } from 'lucide-react';

interface CompleteScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export function CompleteScreen({ onNavigate }: CompleteScreenProps) {
  const { userData } = useUser();
  const { triggerHaptic } = useHapticFeedback();

  const handleStartOver = () => {
    triggerHaptic('medium');
    onNavigate('landing');
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 p-6">
      <div className="flex justify-center mb-8">
        <img 
          src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
          alt="ONER"
          className="h-12 w-auto"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-8">
          We'll be in touch with your perfect fit soon, {userData.name}!
        </p>

        <Button
          onClick={handleStartOver}
          className="w-full max-w-md h-14 bg-gray-900 text-white hover:bg-gray-800 group"
        >
          <span>Start Over</span>
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}