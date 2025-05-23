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
			console.log('Key pressed:', key);

			if (key === 'arrowup' || key === 'arrowdown') {
				console.log('Starting timer for key:', key);
				// start a 10s timer
				window.setTimeout(() => {
					router.push('/'); // navigate to home
				}, 2000);
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
