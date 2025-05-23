'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

type HoldInfo = {
	timestamp: number;
	timerId: number;
};

export function KeyHoldNavigator() {
	const router = useRouter();
	const holds = useRef<Record<string, HoldInfo>>({});

	useEffect(() => {
		const THRESHOLD = 2000; // ms

		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if ((key === 'arrowup' || key === 'arrowdown') && !holds.current[key]) {
				// mark start time
				const start = performance.now();
				// schedule a forced navigation in case `keyup` never arrives
				const id = window.setTimeout(() => {
					router.push('/');
					delete holds.current[key];
				}, THRESHOLD);

				holds.current[key] = { timestamp: start, timerId: id };
			}
		};

		const handleKeyUp = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			const info = holds.current[key];
			if (info) {
				const heldFor = performance.now() - info.timestamp;
				clearTimeout(info.timerId);
				delete holds.current[key];
				// only navigate if they really held it long enough
				if (heldFor >= THRESHOLD) {
					router.push('/');
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			// clean up any stray timers
			Object.values(holds.current).forEach((h) => clearTimeout(h.timerId));
			holds.current = {};
		};
	}, [router]);

	return null;
}
