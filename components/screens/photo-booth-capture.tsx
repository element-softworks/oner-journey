'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam'; // ← ordinary import
import { Button } from '@/components/ui/button';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS } from '@/lib/socket-events';
import { toast } from '@/hooks/use-toast';
import { Camera, X } from 'lucide-react';

function dataURItoBlob(dataUri: string) {
	const [, mime] = dataUri.split(';')[0].split(':');
	const byteString = atob(dataUri.split(',')[1]);
	const ab = new ArrayBuffer(byteString.length);
	const ia = new Uint8Array(ab);
	for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
	return new Blob([ab], { type: mime });
}

interface PhotoBoothCaptureProps {
	onNavigate: (screen: PhotoBoothScreen, data?: { blob: Blob }) => void;
	sessionId: string;
}

export function PhotoBoothCapture({ onNavigate, sessionId }: PhotoBoothCaptureProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState<number | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (isReady) return;
		setTimeout(() => {
			setIsReady(true);
		}, 100);
	}, [isReady]);

	console.log(isReady, 'isReady data');

	const webcamRef = useRef<Webcam>(null);
	const countdownRef = useRef<NodeJS.Timeout | null>(null);
	const { triggerHaptic } = useHapticFeedback();

	/* ----------------------------- camera events ---------------------------- */

	/** called automatically when react-webcam gets a stream */
	const handleUserMedia = () => {
		setIsLoading(false);
		setError(null);
	};

	/** called if getUserMedia rejects */
	const handleUserMediaError = (err: Error) => {
		console.error(err);
		setIsLoading(false);
		setError(
			err.name === 'NotAllowedError'
				? 'Camera permission was denied. Please enable it in your browser settings.'
				: 'Failed to access camera.'
		);
	};

	const capturePhoto = useCallback(() => {
		const base64 = webcamRef.current?.getScreenshot({ width: 1024, height: 1024 });
		return base64 ? dataURItoBlob(base64) : null;
	}, []);

	/* --------------------------- countdown logic --------------------------- */

	function startCaptureSequence() {
		[3, 2, 1].forEach((num, i) => {
			setTimeout(() => {
				setCountdown(num);
				triggerHaptic(i === 0 ? 'medium' : 'light');

				if (num === 1) {
					// one more second after showing “1”
					setTimeout(() => {
						setCountdown(null);
						const blob = capturePhoto();
						if (blob) {
							triggerHaptic('heavy');
							onNavigate('preview', { blob });
						}
					}, 1_000);
				}
			}, i * 1_000);
		});
	}

	/* ----------------------------- socket hooks ----------------------------- */

	useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.KIOSK,
		handlers: {
			[CORE_EVENTS.JOINED_ROOM]: () => console.log(`Kiosk joined room ${sessionId}`),
			[CORE_EVENTS.ERROR]: (err: string) =>
				toast({ title: 'Socket error', description: err, variant: 'destructive' }),
			[KIOSK_EVENTS.TRIGGER_CAMERA]: () => {
				startCaptureSequence();
			},
			[KIOSK_EVENTS.MOBILE_JOINED]: () => {
				console.log('cancel photo data ccc', isReady);
				if (!isReady) return;

				if (countdownRef.current) clearInterval(countdownRef.current);
				setCountdown(null);
				onNavigate('details');
			},
			[KIOSK_EVENTS.CANCEL_PHOTO]: () => {
				console.log('cancel photo data ccc', isReady);
				// if (!isReady) return;
				if (countdownRef.current) clearInterval(countdownRef.current);
				setCountdown(null);
				onNavigate('details');
			},
		},
	});

	/* -------------------------------- render -------------------------------- */

	if (error) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center bg-[#1C4639] p-6">
				<div className="w-full  space-y-6 rounded-2xl bg-white p-8 shadow-lg">
					<h2 className="text-center text-2xl font-bold text-gray-900">
						Camera Access Required
					</h2>
					<p className="text-center text-gray-600">{error}</p>
					<Button onClick={() => window.location.reload()} className="h-14 w-full">
						<Camera className="mr-2 h-5 w-5" />
						Retry Camera Access
					</Button>
					<Button
						variant="outline"
						onClick={() => onNavigate('details')}
						className="h-14 w-full"
					>
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	const CAMERA_TRANSFORM = `rotate(${process.env.NEXT_PUBLIC_CAMERA_ROTATION})`;

	return (
		<div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#1C4639] px-4 py-16">
			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
				alt="ONER"
				className="h-60 w-auto mb-auto"
			/>

			{/* Spinner while loading camera */}
			{isLoading && (
				<div className="absolute inset-0 z-10 flex items-center justify-center ">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-white" />
				</div>
			)}

			<div style={{ transform: CAMERA_TRANSFORM, aspectRatio: 1, maxWidth: 1024 }}>
				<Webcam
					ref={webcamRef}
					audio={false}
					mirrored
					screenshotFormat="image/jpeg"
					videoConstraints={{
						facingMode: { ideal: 'user' },
						width: { ideal: 1024 },
						height: { ideal: 1024 },
					}}
					onUserMedia={handleUserMedia}
					onUserMediaError={handleUserMediaError}
					className="h-full w-full object-cover"
				/>
			</div>

			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
				alt="ONER"
				className="h-32 w-auto mt-auto"
			/>

			{countdown !== null && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="drop-shadow-lg text-9xl font-extrabold text-white">
						{countdown}
					</span>
				</div>
			)}
		</div>
	);
}
