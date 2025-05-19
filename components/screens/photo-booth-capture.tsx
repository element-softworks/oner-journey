'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, X } from 'lucide-react';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS, MOBILE_EVENTS } from '@/lib/socket-events';
import { toast } from '@/hooks/use-toast';

interface PhotoBoothCaptureProps {
	/**
	 * When the photo is taken we pass the blob to the next screen so it can be previewed / uploaded.
	 */
	onNavigate: (
		screen: PhotoBoothScreen,
		data?: {
			blob: Blob;
		}
	) => void;
	sessionId: string;
}

export function PhotoBoothCapture({ onNavigate, sessionId }: PhotoBoothCaptureProps) {
	/** Generic state */
	const [isLoading, setIsLoading] = useState(true);
	const [hasPermission, setHasPermission] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/** Countdown 3-2-1 */
	const [countdown, setCountdown] = useState<number | null>(null);

	/** Refs */
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const countdownRef = useRef<NodeJS.Timeout | null>(null);

	const { triggerHaptic } = useHapticFeedback();

	/* -------------------------------------------------------------------------- */
	/*                               Camera access                                */
	/* -------------------------------------------------------------------------- */

	const stopStream = () => {
		streamRef.current?.getTracks().forEach((t) => t.stop());
		streamRef.current = null;
	};

	const initializeCamera = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// navigator.permissions is still missing in Safari, so we feature-detect.
			if (navigator.permissions?.query) {
				const status = await navigator.permissions.query({
					name: 'camera' as PermissionName,
				});
				if (status.state === 'denied') {
					throw new Error(
						'Camera permission was denied. Please enable it in your browser settings.'
					);
				}
			}

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: 'user' },
					width: { ideal: 1920 },
					height: { ideal: 1080 },
				},
			});

			console.log('all tracks:', stream.getTracks());
			console.log('video tracks:', stream.getVideoTracks());

			if (videoRef.current) {
				const vid = videoRef.current;
				vid.onloadedmetadata = () => {
					console.log('video size:', vid.videoWidth, vid.videoHeight);
				};
				vid.srcObject = stream;
				await vid.play();
				console.log('video.paused =', vid.paused);
			}

			streamRef.current = stream;
			setHasPermission(true);
		} catch (err) {
			console.error('Camera access error:', err);
			let message = 'Failed to access camera.';
			if (err instanceof DOMException) {
				switch (err.name) {
					case 'NotAllowedError':
					case 'PermissionDeniedError':
						message =
							'Camera permission was denied. Please enable it in your browser settings.';
						break;
					case 'NotFoundError':
						message =
							'No camera device was found. Please connect a camera and try again.';
						break;
					case 'NotReadableError':
						message =
							'Your camera is already in use by another application. Close other apps and try again.';
						break;
				}
			}
			setHasPermission(false);
			setError(message);
		} finally {
			setIsLoading(false);
		}
	}, [videoRef, streamRef, setIsLoading, setError, setHasPermission]);

	useEffect(() => {
		initializeCamera();
		return stopStream; // clean-up on unmount
	}, [initializeCamera]);

	/* -------------------------------------------------------------------------- */
	/*                            Counting & Taking photo                         */
	/* -------------------------------------------------------------------------- */

	const capturePhoto = async () => {
		if (!videoRef.current) return null;

		const video = videoRef.current;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext('2d');
		if (!ctx) return null;

		// Mirror so the resulting photo matches the preview.
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		return new Promise<Blob | null>((resolve) => {
			canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
		});
	};

	const beginCountdown = () => {
		triggerHaptic('medium');
		setCountdown(3);

		countdownRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev === null) return null;
				if (prev > 1) {
					triggerHaptic('light');
					return prev - 1;
				}

				// prev === 1 –> flash!
				if (countdownRef.current) {
					clearInterval(countdownRef.current);
				}
				setCountdown(null);

				(async () => {
					const blob = await capturePhoto();
					if (blob) {
						triggerHaptic('heavy');
						onNavigate('preview', { blob });
					}
				})();

				return null;
			});
		}, 1000);
	};

	const { socket } = useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.KIOSK,
		handlers: {
			// server-side error
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Kiosk joined room ${sessionId}`);
			},
			[CORE_EVENTS.ERROR]: (err: string) => {
				console.error('Socket error', err);
				toast({ title: 'Socket error', description: err, variant: 'destructive' });
			},

			[KIOSK_EVENTS.TRIGGER_CAMERA]: (data) => {
				console.log('Take photo event received:', data);
				beginCountdown();
			},
			[KIOSK_EVENTS.CANCEL_PHOTO]: () => {
				console.log('Cancel event received');
				if (countdownRef.current) {
					clearInterval(countdownRef.current);
					setCountdown(null);
				}
				onNavigate('details');
			},
		},
	});

	/* -------------------------------------------------------------------------- */
	/*                               UI handlers                                  */
	/* -------------------------------------------------------------------------- */

	const handleCancel = () => {
		triggerHaptic('light');
		onNavigate('details');
	};

	const handleRetry = () => {
		stopStream();
		initializeCamera();
	};

	/* -------------------------------------------------------------------------- */
	/*                                 Render                                     */
	/* -------------------------------------------------------------------------- */

	if (isLoading) {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
				<div className="text-gray-900 text-center">
					<p className="mb-2">Accessing camera...</p>
					<div className="mx-auto w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
				</div>
			</div>
		);
	}

	if (error || !hasPermission) {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
				<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
					<h2 className="text-center text-2xl font-bold text-gray-900">
						Camera Access Required
					</h2>
					<p className="text-center text-gray-600">{error}</p>
					<Button
						onClick={handleRetry}
						className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800"
					>
						<Camera className="mr-2 h-5 w-5" />
						Retry Camera Access
					</Button>
					<Button
						onClick={handleCancel}
						variant="outline"
						className="w-full h-14 border-gray-200 text-gray-900 hover:bg-gray-50"
					>
						Go Back
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#e5e5e5] px-4 py-8">
			<img
				src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
				alt="ONER"
				className="h-12 w-auto mx-auto mb-4"
			/>
			{/* Video preview */}
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className="w-full h-full object-cover mirror"
			/>

			{/* Countdown overlay */}
			{countdown !== null && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white text-9xl font-extrabold drop-shadow-lg">
						{countdown}
					</span>
				</div>
			)}
		</div>
	);
}
