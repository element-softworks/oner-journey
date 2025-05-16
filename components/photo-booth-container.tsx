'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PhotoBoothLanding } from '@/components/screens/photo-booth-landing';
import { PhotoBoothWelcome } from '@/components/screens/photo-booth-welcome';
import { PhotoBoothCapture } from '@/components/screens/photo-booth-capture';
import { PhotoBoothDetails } from './screens/photo-booth-details';
import { PhotoBoothPreview } from './screens/photo-booth-preview';
import { PhotoBoothThankYou } from './screens/photo-booth-thank-you';

export type PhotoBoothScreen =
	| 'landing'
	| 'welcome'
	| 'details'
	| 'capture'
	| 'preview'
	| 'thank-you';

interface PhotoBoothContainerProps {
	initialScreen?: PhotoBoothScreen;
}

export function PhotoBoothContainer({ initialScreen = 'landing' }: PhotoBoothContainerProps) {
	const [currentScreen, setCurrentScreen] = useState<PhotoBoothScreen>(initialScreen);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [photo, setPhoto] = useState<Blob | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const navigateToScreen = (screen: PhotoBoothScreen, data?: { blob?: Blob }) => {
		setIsTransitioning(true);

		if (!!data?.blob) {
			setPhoto(data?.blob);
		}
		const path = getPathForScreen(screen);
		setTimeout(() => {
			setCurrentScreen(screen);
			router.push(path);
			setIsTransitioning(false);
		}, 300);
	};

	const getPathForScreen = (screen: PhotoBoothScreen): string => {
		switch (screen) {
			case 'landing':
				return '/photo-booth/start';
			case 'details':
				return '/photo-booth/details';
			case 'welcome':
				return '/photo-booth/form';
			case 'capture':
				return '/photo-booth/capture';
			case 'preview':
				return '/photo-booth/preview';
			case 'thank-you':
				return '/photo-booth/thank-you';
			default:
				return '/photo-booth/start';
		}
	};

	return (
		<div
			className={`w-full h-full transition-opacity duration-300 ${
				isTransitioning ? 'opacity-0' : 'opacity-100'
			}`}
		>
			{currentScreen === 'landing' && (
				<PhotoBoothLanding
					onStart={() => navigateToScreen('details')}
					onBack={() => router.push('/')}
				/>
			)}
			{currentScreen === 'details' && <PhotoBoothDetails onNavigate={navigateToScreen} />}
			{currentScreen === 'welcome' && <PhotoBoothWelcome onNavigate={navigateToScreen} />}
			{currentScreen === 'thank-you' && <PhotoBoothThankYou onNavigate={navigateToScreen} />}

			{currentScreen === 'capture' && (
				<>
					{!!photo ? (
						<PhotoBoothPreview
							photo={photo}
							onNavigate={navigateToScreen}
							onRetake={() => {
								setPhoto(null);
							}}
						/>
					) : (
						<PhotoBoothCapture
							onNavigate={(screen: PhotoBoothScreen, data?: { blob?: Blob }) => {
								if (screen === 'details') {
									navigateToScreen(screen);
								} else {
								}

								if (!!data?.blob) {
									setPhoto(data?.blob);
								}
							}}
						/>
					)}
				</>
			)}
		</div>
	);
}
