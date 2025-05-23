// components/KeyHoldNavigator.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type KeyTimers = {
	[key: string]: number; // setTimeout ID
};

export function KeyHoldNavigator() {
	const router = useRouter();
	const timers = useRef<KeyTimers>({});

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if ((key === 'w' || key === 'a') && !timers.current[key]) {
				// start a 10s timer
				timers.current[key] = window.setTimeout(() => {
					if (key === 'w') {
						router.push('/photo-booth');
					} else {
						router.push('/outfit-selector');
					}
				}, 10_000);
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if (timers.current[key]) {
				clearTimeout(timers.current[key]);
				delete timers.current[key];
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			// clear any remaining timers
			Object.values(timers.current).forEach(clearTimeout);
			timers.current = {};
		};
	}, [router]);

	return null;
}
