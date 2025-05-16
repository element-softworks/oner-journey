'use client';

import { Button } from '@/components/ui/button';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';

interface PhotoBoothMobileCaptureProps {
	onNavigate: (screen: PhotoBoothMobileScreen, data?: { blob?: Blob }) => void;
	onCancel: () => void;
}

export function PhotoBoothMobileCapture({ onNavigate, onCancel }: PhotoBoothMobileCaptureProps) {
	const handleTakePhoto = () => {
		// For now, just navigate to preview with a mock photo
		const mockBlob = new Blob(['mock photo data'], { type: 'image/jpeg' });
		onNavigate('preview', { blob: mockBlob });
	};

	return (
		<div className="flex flex-col h-full bg-white p-6">
			<div className="flex justify-center mb-8">
				<img
					src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
					alt="ONER ACTIVE"
					className="h-8 w-auto"
				/>
			</div>

			<div className="flex-1 flex flex-col items-center  space-y-4">
				<Button
					onClick={handleTakePhoto}
					className="w-full h-12 bg-black text-white hover:bg-gray-900"
				>
					TAKE PHOTO
				</Button>

				<Button onClick={onCancel} variant="outline" className="w-full h-12 border-2">
					CANCEL
				</Button>
			</div>
		</div>
	);
}
