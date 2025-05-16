'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, X } from 'lucide-react';

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
}

export function PhotoBoothCapture({ onNavigate }: PhotoBoothCaptureProps) {
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

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
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
	}, []);

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
		<div className="relative w-full h-screen bg-black">
			{/* Video preview */}
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted
				className="w-full h-full object-cover mirror"
			/>
			<style jsx>{`
				.mirror {
					transform: scaleX(-1);
				}
			`}</style>

			{/* Countdown overlay */}
			{countdown !== null && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-white text-9xl font-extrabold drop-shadow-lg">
						{countdown}
					</span>
				</div>
			)}

			{/* Top controls */}
			<div className="absolute inset-x-0 top-6 flex justify-between px-6">
				<Button
					onClick={handleCancel}
					variant="ghost"
					size="icon"
					className="text-white hover:bg-white/20"
				>
					<X className="h-6 w-6" />
					<span className="sr-only">Cancel</span>
				</Button>
			</div>

			{/* Bottom controls */}
			<div className="absolute inset-x-0 bottom-0 p-6">
				<Button
					onClick={beginCountdown}
					size="lg"
					disabled={countdown !== null}
					className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-50"
				>
					<Camera className="mr-2 h-5 w-5" />
					{countdown ? 'Smile!' : 'Take Photo'}
				</Button>
			</div>
		</div>
	);
}
