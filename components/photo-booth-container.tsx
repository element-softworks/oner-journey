'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PhotoBoothLanding } from '@/components/screens/photo-booth-landing';
import { PhotoBoothWelcome } from '@/components/screens/photo-booth-welcome';
import { PhotoBoothCapture } from '@/components/screens/photo-booth-capture';
import { PhotoBoothDetails } from './screens/photo-booth-details';
import { PhotoBoothPreview } from './screens/photo-booth-preview';
import { PhotoBoothThankYou } from './screens/photo-booth-thank-you';
import { IdleTimer } from '@/components/idle-timer';
import { DEVICE_TYPE } from '@/lib/socket-events';

export type PhotoBoothScreen =
	| 'landing'
	| 'welcome'
	| 'details'
	| 'capture'
	| 'preview'
	| 'thank-you';

interface PhotoBoothContainerProps {
	initialScreen?: PhotoBoothScreen;
	sessionId?: string;
	email?: string;
	name?: string;
}

export function PhotoBoothContainer({
	initialScreen = 'landing',
	sessionId,
	email,
	name,
}: PhotoBoothContainerProps) {
	const [currentScreen, setCurrentScreen] = useState<PhotoBoothScreen>(initialScreen);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [photo, setPhoto] = useState<Blob | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const navigateToScreen = (
		screen: PhotoBoothScreen,
		data?: { blob?: Blob; email?: string; name?: string }
	) => {
		setIsTransitioning(true);

		if (!!data?.blob) {
			setPhoto(data?.blob);
		}
		const path = getPathForScreen(screen, data);
		setTimeout(() => {
			setCurrentScreen(screen);
			router.push(path);
			setIsTransitioning(false);
		}, 300);
	};

	const getPathForScreen = (
		screen: PhotoBoothScreen,
		data?: {
			blob?: Blob;
			email?: string;
			name?: string;
		}
	): string => {
		switch (screen) {
			case 'landing':
				return `/photo-booth/start`;
			case 'details':
				return `/photo-booth/details?sessionId=${sessionId}${
					!!data?.email ? `&email=${data?.email}` : ''
				}${!!data?.name ? `&name=${data?.name}` : ''}`;
			case 'welcome':
				return `/photo-booth/form?sessionId=${sessionId}${
					!!data?.email ? `&email=${data?.email}` : ''
				}${!!data?.name ? `&name=${data?.name}` : ''}`;
			case 'capture':
				return `/photo-booth/capture?sessionId=${sessionId}${
					!!data?.email ? `&email=${data?.email}` : ''
				}${!!data?.name ? `&name=${data?.name}` : ''}`;
			case 'preview':
				return `/photo-booth/preview?sessionId=${sessionId}${
					!!data?.email ? `&email=${data?.email}` : ''
				}${!!data?.name ? `&name=${data?.name}` : ''}`;
			case 'thank-you':
				return `/photo-booth/thank-you?sessionId=${sessionId}${
					!!data?.email ? `&email=${data?.email}` : ''
				}${!!data?.name ? `&name=${data?.name}` : ''}`;
			default:
				return `/photo-booth/start`;
		}
	};

	return (
		<div
			className={`w-full h-full transition-opacity duration-300 ${
				isTransitioning ? 'opacity-0' : 'opacity-100'
			}`}
		>
			{!!sessionId && <IdleTimer sessionId={sessionId!} role={DEVICE_TYPE.KIOSK} />}

			{currentScreen === 'landing' && (
				<PhotoBoothLanding
					onStart={(sessionId: string) =>
						router.push(`/photo-booth/details?sessionId=${sessionId}`)
					}
					onBack={() => router.push('/')}
				/>
			)}
			{currentScreen === 'details' && (
				<PhotoBoothDetails sessionId={sessionId ?? ''} onNavigate={navigateToScreen} />
			)}
			{currentScreen === 'welcome' && <PhotoBoothWelcome onNavigate={navigateToScreen} />}
			{currentScreen === 'thank-you' && <PhotoBoothThankYou onNavigate={navigateToScreen} />}

			{currentScreen === 'capture' && (
				<>
					{!!photo ? (
						<PhotoBoothPreview
							name={name}
							email={email}
							sessionId={sessionId ?? ''}
							photo={photo}
							onNavigate={navigateToScreen}
							onRetake={() => {
								setPhoto(null);
							}}
						/>
					) : (
						<PhotoBoothCapture
							sessionId={sessionId ?? ''}
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
