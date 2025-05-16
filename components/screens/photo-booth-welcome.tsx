"use client";

import { useState } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { validateName, validateEmail } from '@/lib/validators';
import { ArrowRight, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhotoBoothWelcomeProps {
  onNavigate: (screen: PhotoBoothScreen) => void;
}

export function PhotoBoothWelcome({ onNavigate }: PhotoBoothWelcomeProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  const { toast } = useToast();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim() !== '') {
      setNameError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim() !== '') {
      setEmailError('');
    }
  };

  const handleSubmit = () => {
    let isValid = true;

    if (!validateName(name)) {
      setNameError('Please enter your name');
      triggerHaptic('error');
      isValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      triggerHaptic('error');
      isValid = false;
    }

    if (!isValid) return;

    triggerHaptic('success');
    toast({
      title: "Let's take your photo!",
      description: `Get ready ${name}!`,
    });
    onNavigate('capture');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Photo Booth</h1>
            <p className="text-gray-600">To take a photo, enter your details below</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label 
                htmlFor="name" 
                className={`text-sm transition-colors duration-200 ${nameError ? 'text-red-500' : 'text-gray-600'}`}
              >
                {nameError || 'Your Name'}
              </Label>
              <div className={`relative border-b-2 transition-colors duration-300 ${
                nameError ? 'border-red-500' : 
                isNameFocused ? 'border-gray-900' : 'border-gray-200'
              }`}>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  placeholder="Enter your name"
                  className="bg-transparent border-0 text-gray-900 text-lg h-14 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="email" 
                className={`text-sm transition-colors duration-200 ${emailError ? 'text-red-500' : 'text-gray-600'}`}
              >
                {emailError || 'Your Email'}
              </Label>
              <div className={`relative border-b-2 transition-colors duration-300 ${
                emailError ? 'border-red-500' : 
                isEmailFocused ? 'border-gray-900' : 'border-gray-200'
              }`}>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="Enter your email address"
                  className="bg-transparent border-0 text-gray-900 text-lg h-14 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                  autoComplete="email"
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-14 mt-8 bg-gray-900 text-white hover:bg-gray-800 group"
          >
            <Camera className="mr-2 h-5 w-5" />
            <span>Take Photo</span>
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}