"use client";

import { useState } from 'react';
import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { validateName } from '@/lib/validators';
import { ArrowRight } from 'lucide-react';

interface NameEntryScreenProps {
  onNavigate: (screen: AppScreen) => void;
}

export function NameEntryScreen({ onNavigate }: NameEntryScreenProps) {
  const { userData, updateName } = useUser();
  const [name, setName] = useState(userData.name);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    if (value.trim() !== '') {
      setError('');
    }
  };
  
  const handleContinue = () => {
    if (!validateName(name)) {
      setError('Please enter your name to continue');
      triggerHaptic('error');
      return;
    }
    
    updateName(name);
    triggerHaptic('success');
    onNavigate('email');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleContinue();
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ONER</h1>
            <p className="text-gray-600">Let's get to know you</p>
          </div>
          
          <div className="space-y-3">
            <Label 
              htmlFor="name" 
              className={`text-sm transition-colors duration-200 ${error ? 'text-red-500' : 'text-gray-600'}`}
            >
              {error || 'Your Name'}
            </Label>
            
            <div className={`relative border-b-2 transition-colors duration-300 ${
              error ? 'border-red-500' : 
              isFocused ? 'border-gray-900' : 'border-gray-200'
            }`}>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your name"
                className="bg-transparent border-0 text-gray-900 text-lg h-14 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                autoComplete="name"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleContinue}
            className="w-full h-14 mt-8 bg-gray-900 text-white hover:bg-gray-800 group"
          >
            <span>Continue</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}