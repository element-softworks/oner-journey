'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { createKioskSession } from '@/actions/create-kiosk-session';
import { generateQRCodeDataUrl } from '@/actions/generate-qr-code';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, KIOSK_EVENTS, DEVICE_TYPE } from '@/lib/socket-events';

interface PhotoBoothLandingProps {
	onStart: (sessionId: string) => void;
	onBack: () => void;
}

export function PhotoBoothLanding({ onStart, onBack }: PhotoBoothLandingProps) {
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
				onStart(sessionId);
			},
		},
	});

	// 3) Background video autoplay
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const attemptPlay = async () => {
			try {
				await video.play();
			} catch {
				const resume = async () => {
					try {
						await video.play();
					} catch {}
					document.removeEventListener('click', resume);
				};
				document.addEventListener('click', resume);
			}
		};
		attemptPlay();

		return () => {
			video.pause();
			video.src = '';
		};
	}, []);

	const handleBack = () => {
		triggerHaptic('light');
		onBack();
	};

	return (
		<div className="relative w-full h-screen">
			<video
				ref={videoRef}
				className="w-full h-full object-cover"
				playsInline
				muted
				loop
				autoPlay
				preload="auto"
				poster="https://images.pexels.com/photos/7319307/pexels-photo-7319307.jpeg"
			>
				<source src="https://i.imgur.com/NAPXMiL.mp4" type="video/mp4" />
			</video>

			<div className="absolute inset-0 bg-black/40 z-10" />

			<div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6">
				<Button
					onClick={handleBack}
					variant="ghost"
					size="icon"
					className="self-start text-white hover:bg-white/10"
				>
					<ArrowLeft className="h-6 w-6" />
					<span className="sr-only">Back</span>
				</Button>

				{qrCodeUrl ? (
					<div className="flex flex-col items-center mb-6">
						<h1 className="text-2xl lg:text-3xl max-w-[20ch] font-bold text-white text-center mb-2">
							SCAN THE QR CODE TO CONNECT YOUR PHONE
						</h1>
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
	);
}
