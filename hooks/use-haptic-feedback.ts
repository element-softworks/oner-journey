"use client";

import { useEffect, useState } from 'react';

type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'error';

export function useHapticFeedback() {
  const [hasVibration, setHasVibration] = useState(false);
  
  useEffect(() => {
    setHasVibration('vibrate' in navigator);
  }, []);
  
  const triggerHaptic = (intensity: HapticIntensity = 'medium') => {
    if (!hasVibration) return;
    
    switch (intensity) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(35);
        break;
      case 'heavy':
        navigator.vibrate(60);
        break;
      case 'success':
        navigator.vibrate([10, 30, 60]);
        break;
      case 'error':
        navigator.vibrate([60, 50, 60]);
        break;
      default:
        navigator.vibrate(35);
    }
  };
  
  return { triggerHaptic, hasVibration };
}