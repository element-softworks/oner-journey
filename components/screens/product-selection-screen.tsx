"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ArrowRight } from 'lucide-react';
import { EmblaCarousel } from '@/components/ui/embla-carousel';
import { TOPS } from '@/lib/data/tops';
import { BOTTOMS } from '@/lib/data/bottoms';

interface ProductSelectionScreenProps {
  onNavigate: (screen: AppScreen) => void;
  onSelectionChange: (top: number, topColor: string, bottom: number, bottomColor: string) => void;
  initialTop: number;
  initialTopColor: string;
  initialBottom: number;
  initialBottomColor: string;
}

export function ProductSelectionScreen({ 
  onNavigate, 
  onSelectionChange,
  initialTop,
  initialTopColor,
  initialBottom,
  initialBottomColor
}: ProductSelectionScreenProps) {
  const [selectedTopIndex, setSelectedTopIndex] = useState(initialTop);
  const [topColor, setTopColor] = useState(initialTopColor);
  const [selectedBottomIndex, setSelectedBottomIndex] = useState(initialBottom);
  const [bottomColor, setBottomColor] = useState(initialBottomColor);
  const { triggerHaptic } = useHapticFeedback();

  const handleContinue = () => {
    onSelectionChange(selectedTopIndex, topColor, selectedBottomIndex, bottomColor);
    triggerHaptic('medium');
    onNavigate('summary');
  };

  const getCurrentTopImage = () => {
    if (selectedTopIndex === null || !TOPS[selectedTopIndex]) return null;
    
    const currentTop = TOPS[selectedTopIndex];
    if (currentTop.colorImages && topColor && currentTop.colorImages[topColor]) {
      return currentTop.colorImages[topColor];
    }
    return currentTop.image;
  };

  const handleTopChange = (index: number) => {
    if (!TOPS[index]) return;

    const newTop = TOPS[index];
    setSelectedTopIndex(index);

    const colorExists = newTop.colors.some(color => color.value === topColor);
    if (!colorExists) {
      setTopColor(newTop.colors[0]?.value || '');
    }
    
    triggerHaptic('light');
  };

  const handleBottomChange = (index: number) => {
    setSelectedBottomIndex(index);
    triggerHaptic('light');
  };

  if (TOPS.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-900">No products available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="flex flex-col items-center pt-8 px-6">
        <img 
          src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
          alt="ONER"
          className="h-12 w-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-900">Win Your Fit</h1>
        <p className="text-gray-600 mb-6">Select your perfect combination</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mt-4">
          <EmblaCarousel 
            slides={TOPS.map((top, index) => ({
              ...top,
              image: index === selectedTopIndex ? getCurrentTopImage() || top.image : top.image
            }))}
            onSlideChange={handleTopChange}
            initialSlide={initialTop}
          />
          
          {selectedTopIndex !== null && TOPS[selectedTopIndex] && (
            <div className="flex justify-center gap-3 mt-4">
              {TOPS[selectedTopIndex].colors.map((color) => (
                <motion.button
                  key={color.value}
                  onClick={() => {
                    setTopColor(color.value);
                    triggerHaptic('light');
                  }}
                  className={`w-8 h-8 rounded-full transition-transform ${
                    topColor === color.value ? 'scale-110 ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Select ${color.name}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <EmblaCarousel 
            slides={BOTTOMS}
            onSlideChange={handleBottomChange}
            initialSlide={initialBottom}
          />
          
          <div className="flex justify-center gap-3 mt-4">
            {[
              { name: 'True Blue', value: '#8896B2' },
              { name: 'Black', value: '#000000' },
              { name: 'Grey', value: '#4A4A4A' }
            ].map((color) => (
              <motion.button
                key={color.value}
                onClick={() => {
                  setBottomColor(color.value);
                  triggerHaptic('light');
                }}
                className={`w-8 h-8 rounded-full transition-transform ${
                  bottomColor === color.value ? 'scale-110 ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50' : ''
                }`}
                style={{ backgroundColor: color.value }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Select ${color.name}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 group"
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}