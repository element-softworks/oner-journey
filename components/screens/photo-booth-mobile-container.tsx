'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PhotoBoothMobileDetails } from './photo-booth-mobile-details';
import { PhotoBoothMobileCapture } from './photo-booth-mobile-capture';
import { PhotoBoothMobilePreview } from './photo-booth-mobile-preview';
import { PhotoBoothMobileThankYou } from './photo-booth-mobile-thank-you';

export type PhotoBoothMobileScreen = 'details' | 'capture' | 'preview' | 'thank-you';

interface PhotoBoothMobileContainerProps {
	initialScreen?: PhotoBoothMobileScreen;
}

export function PhotoBoothMobileContainer({
	initialScreen = 'details',
}: PhotoBoothMobileContainerProps) {
	const [currentScreen, setCurrentScreen] = useState<PhotoBoothMobileScreen>(initialScreen);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [photo, setPhoto] = useState<Blob | null>(null);
	const router = useRouter();

	const navigateToScreen = (screen: PhotoBoothMobileScreen, data?: { blob?: Blob }) => {
		setIsTransitioning(true);

		if (data?.blob) {
			setPhoto(data.blob);
		}

		const path = getPathForScreen(screen);
		router.push(path);

		setTimeout(() => {
			setCurrentScreen(screen);
			setIsTransitioning(false);
		}, 300);
	};

	const getPathForScreen = (screen: PhotoBoothMobileScreen): string => {
		return `/photo-booth/mobile/${screen}`;
	};

	return (
		<div
			className={`w-full h-full transition-opacity duration-300 ${
				isTransitioning ? 'opacity-0' : 'opacity-100'
			}`}
		>
			{currentScreen === 'details' && (
				<PhotoBoothMobileDetails onNavigate={navigateToScreen} />
			)}

			{currentScreen === 'capture' && (
				<PhotoBoothMobileCapture
					onNavigate={(screen, data) => {
						if (data?.blob) {
							setPhoto(data.blob);
						}
						navigateToScreen(screen, data);
					}}
					onCancel={() => navigateToScreen('details')}
				/>
			)}

			{currentScreen === 'preview' && (
				<PhotoBoothMobilePreview
					onAccept={() => navigateToScreen('thank-you')}
					onRetake={() => {
						setPhoto(null);
						navigateToScreen('capture');
					}}
					onCancel={() => navigateToScreen('details')}
				/>
			)}

			{currentScreen === 'thank-you' && <PhotoBoothMobileThankYou />}
		</div>
	);
}
