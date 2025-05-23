'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createKioskSession } from '@/actions/create-kiosk-session';
import { generateQRCodeDataUrl } from '@/actions/generate-qr-code';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, KIOSK_EVENTS, DEVICE_TYPE } from '@/lib/socket-events';
import { useMerlinSession } from '@merlincloud/mc-package';

interface PhotoBoothLandingProps {
	onStart: (sessionId: string) => void;
	onBack: () => void;
}

export function PhotoBoothLanding({ onStart, onBack }: PhotoBoothLandingProps) {
	const { startSession: startMerlinSession } = useMerlinSession();
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
	const [sessionId, setSessionId] = useState<string>('');
	const { triggerHaptic } = useHapticFeedback();
	const videoRef = useRef<HTMLVideoElement>(null);
	const hasInitialized = useRef(false);

	// 1) Generate a new session and QR code on mount
	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;
		(async () => {
			const { sessionId } = await createKioskSession();
			setSessionId(sessionId);
			const dataUrl = await generateQRCodeDataUrl(sessionId);
			setQrCodeUrl(dataUrl);
		})();
	}, []);

	// 2) Join the socket as a kiosk, watch for mobile arrival
	useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.KIOSK,
		handlers: {
			// A) Confirm that *this* kiosk has joined its room
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Kiosk joined room ${sessionId}`);
			},
			// B) Only: when the mobile joins, advance to the next screen
			[KIOSK_EVENTS.MOBILE_JOINED]: () => {
				console.log(`Mobile joined room ${sessionId}`);
				startMerlinSession(sessionId);
				onStart(sessionId);
			},
		},
	});

	// 3) Background video autoplay
	useEffect(() => {
		const vid = videoRef.current;
		if (!vid) return;

		const onLoadedData = () => console.log('[Video] loadeddata, readyState=', vid.readyState);
		const onPlay = () => console.log('[Video] play event fired');
		const onError = () => console.error('[Video] error:', vid.error);

		vid.addEventListener('loadeddata', onLoadedData);
		vid.addEventListener('play', onPlay);
		vid.addEventListener('error', onError);

		// Force a load + play
		vid.load();
		vid.play().catch((err) => console.warn('[Video] autoplay prevented:', err));

		return () => {
			vid.removeEventListener('loadeddata', onLoadedData);
			vid.removeEventListener('play', onPlay);
			vid.removeEventListener('error', onError);
			vid.pause();
			vid.src = '';
		};
	}, []);

	const handleBack = () => {
		triggerHaptic('light');
		onBack();
	};

	return (
		<div className="relative flex flex-col min-h-[100dvh]">
			{/* Video background */}
			<video
				ref={videoRef}
				className="absolute inset-0 w-full h-full object-cover"
				playsInline
				muted
				loop
				autoPlay
				preload="auto"
			>
				<source src="/videos/think-live-video.mp4" type="video/mp4" />
				Sorry, your browser doesn’t support embedded videos.
			</video>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/50" />

			{/* Main content */}
			<div className="relative z-10 flex flex-col flex-1 items-center justify-center px-4 py-safe-top pb-6">
				{/* Center panel */}
				<div className="flex flex-col items-center text-center">
					<h1
						className="text-white font-bold mb-6 max-w-xl
                         text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
					>
						SCAN BELOW TO USE OUR SELFIE MIRROR
					</h1>

					{qrCodeUrl ? (
						<img
							src={qrCodeUrl}
							alt="Scan QR code"
							className="sm:w-[40vw] w-[60vw] aspect-square rounded-lg border-2 bg-white p-1"
						/>
					) : (
						<p className="text-white text-lg sm:text-xl">Generating session…</p>
					)}
				</div>
			</div>
		</div>
	);
}
