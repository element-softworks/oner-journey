'use client';

import { useEffect, useState, useRef } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, Check, RotateCcw } from 'lucide-react';

interface PhotoBoothPreviewProps {
	/**
	 * Blob coming from the capture step
	 */
	photo: Blob | null;
	/**
	 * Navigate back to a previous or next screen.
	 * - "capture"  → retake
	 * - "share"    → move forward
	 */
	onNavigate: (screen: PhotoBoothScreen) => void;
	onRetake: () => void;
}

export function PhotoBoothPreview({ photo, onNavigate, onRetake }: PhotoBoothPreviewProps) {
	const [url, setUrl] = useState<string | null>(null);

	const { triggerHaptic } = useHapticFeedback();

	useEffect(() => {
		const objectUrl = URL.createObjectURL(photo!);
		setUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [photo]);

	/* -------------------------------------------------------------------------- */
	/*                                   UI                                       */
	/* -------------------------------------------------------------------------- */

	if (!url) return null; // loading very briefly

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#e5e5e5] px-4 py-8">
			{/* Photo with branded frame */}
			<img
				src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
				alt="ONER"
				className="h-12 w-auto mx-auto mb-4"
			/>
			<div className="relative max-h-[80vh] w-auto border-[20px] border-black">
				{/* The captured image */}
				<img
					src={url}
					alt="Your captured selfie"
					className="block object-cover w-full h-full"
					style={{ aspectRatio: '2/3' }}
				/>
			</div>

			{/* Action buttons */}
			<div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
				<Button
					variant="outline"
					onClick={() => {
						triggerHaptic('light');
						onRetake();
					}}
					className="h-14"
				>
					<RotateCcw className="mr-2 h-5 w-5" />
					Retake
				</Button>
				<Button
					onClick={() => {
						triggerHaptic('heavy');
						// onNavigate('share');
					}}
					className="h-14 bg-gray-900 text-white hover:bg-gray-800"
				>
					<Check className="mr-2 h-5 w-5" />
					Continue
				</Button>
			</div>
		</div>
	);
}
