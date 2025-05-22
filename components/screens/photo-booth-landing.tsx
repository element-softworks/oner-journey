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
		<div className="relative w-full h-screen">
			<video
				className="w-full h-full object-cover"
				playsInline
				muted
				loop
				autoPlay
				preload="auto"
			>
				<source src="/videos/think-live-video.mp4" type="video/mp4" />
				Sorry, your browser doesn’t support embedded videos.
			</video>

			<div className="absolute w-full h-full inset-0 bg-black/40 z-10" />

			<div className="absolute inset-0 z-20 w-full h-full flex flex-col items-center justify-between p-6">
				<Button
					onClick={handleBack}
					variant="ghost"
					size="icon"
					className="self-start text-white hover:bg-white/10 z-50"
				>
					<ArrowLeft className="h-6 w-6" />
					<span className="sr-only">Back</span>
				</Button>

				<div className="flex flex-col items-center justify-center w-full h-full gap-4 mx-auto absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<p className="z-[50] text-white text-center text-4xl lg:text-5xl font-bold max-w-[80%] !mb-6">
						SCAN BELOW TO USE OUR SELFIE MIRROR
					</p>

					{qrCodeUrl ? (
						<div className="flex flex-col items-center mb-6">
							<img
								src={qrCodeUrl}
								alt="Scan QR code"
								className="w-44 h-44 mb-2 rounded-lg border bg-white"
							/>
						</div>
					) : (
						<p className="text-white mb-6">Generating session…</p>
					)}
				</div>
			</div>
		</div>
	);
}
