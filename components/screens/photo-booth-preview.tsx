'use client';

import { useEffect, useState } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, Check, RotateCcw } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/lib/utils';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS } from '@/lib/socket-events';

interface PhotoBoothPreviewProps {
	photo: Blob | null;
	onNavigate: (screen: PhotoBoothScreen) => void;
	onRetake: () => void;
	sessionId: string;
}

export function PhotoBoothPreview({
	photo,
	onNavigate,
	onRetake,
	sessionId,
}: PhotoBoothPreviewProps) {
	const [url, setUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { userData } = useUser();
	const { triggerHaptic } = useHapticFeedback();
	const { toast } = useToast();

	useEffect(() => {
		const objectUrl = URL.createObjectURL(photo!);
		setUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [photo]);

	const handleContinue = async () => {
		// if (!url || !userData.email || isSubmitting) return;
		if (!photo || isSubmitting) return;
		setIsSubmitting(true);
		triggerHaptic('medium');

		const base64 = await blobToBase64(photo);

		setIsSubmitting(true);
		triggerHaptic('medium');

		console.log(url, 'confirmted url');
		try {
			const res = await fetch('/api/send-photo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					// email: userData?.email,
					// photoUrl: url,
					// name: userData.name,
					email: 'nathan@and-element.com',
					photoData: base64,
					name: 'Nathan',
				}),
			});

			if (!res.ok) throw new Error('Failed to send email');
			toast({ title: 'Success!', description: 'Your photo is on its way ✉️' });
			onNavigate('thank-you');
		} catch (err) {
			toast({ title: 'Error', description: 'Please try again.', variant: 'destructive' });
		} finally {
			setIsSubmitting(false);
		}
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

			[KIOSK_EVENTS.RETAKE_PHOTO]: (data) => {
				console.log('Cancel photo received:', data);
				triggerHaptic('light');
				onRetake();
			},
			[KIOSK_EVENTS.PHOTO_DECISION]: (data) => {
				console.log('Cancel photo received:', data);
				triggerHaptic('light');
				handleContinue();
			},
		},
	});

	if (!url) return null;

	return (
		<div className="relative w-full h-screen flex flex-col items-center justify-center bg-[#e5e5e5] px-4 py-8">
			<img
				src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
				alt="ONER"
				className="h-12 w-auto mx-auto mb-4"
			/>
			<div className="relative h-full w-auto border-[20px] border-black">
				<img
					src={url}
					alt="Your captured selfie"
					className="block object-cover w-full h-full"
					style={{ aspectRatio: '2/3' }}
				/>
			</div>

			{/* <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
				<Button
					variant="outline"
					onClick={() => {
						triggerHaptic('light');
						onRetake();
					}}
					className="h-14"
					disabled={isSubmitting}
				>
					<RotateCcw className="mr-2 h-5 w-5" />
					Retake
				</Button>
				<Button
					onClick={handleContinue}
					className="h-14 bg-gray-900 text-white hover:bg-gray-800"
					disabled={isSubmitting}
				>
					<Check className="mr-2 h-5 w-5" />
					{isSubmitting ? 'Sending...' : 'Continue'}
				</Button>
			</div> */}
		</div>
	);
}
