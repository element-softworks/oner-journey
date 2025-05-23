'use client';

import { useEffect, useRef, useState } from 'react';
import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Camera, Check, RotateCcw } from 'lucide-react';
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { blobToBase64 } from '@/lib/utils';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS } from '@/lib/socket-events';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PhotoBoothPreviewProps {
	photo: Blob | null;
	onNavigate: (screen: PhotoBoothScreen) => void;
	onRetake: () => void;
	sessionId: string;
	email?: string;
	name?: string;
}

export function PhotoBoothPreview({
	photo,
	onNavigate,
	onRetake,
	sessionId,
	email,
	name,
}: PhotoBoothPreviewProps) {
	const router = useRouter();

	const [url, setUrl] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { userData } = useUser();
	const { triggerHaptic } = useHapticFeedback();
	const { toast } = useToast();
	const hasSubmitted = useRef(false);

	useEffect(() => {
		const objectUrl = URL.createObjectURL(photo!);
		setUrl(objectUrl);

		return () => URL.revokeObjectURL(objectUrl);
	}, [photo]);

	const handleContinue = async () => {
		console.log('submitting photo', photo, email, name, photo);
		if (!email || hasSubmitted.current || !photo) return;
		triggerHaptic('medium');
		hasSubmitted.current = true;

		const base64 = await blobToBase64(photo);

		setIsSubmitting(true);
		triggerHaptic('medium');

		try {
			const res = await fetch('/api/send-photo', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					photoData: base64,
					name: name,
				}),
			});

			if (!res.ok) throw new Error('Failed to send email');
			hasSubmitted.current = false;

			router.push('/photo-booth/thank-you?sessionId=' + sessionId);
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
			[KIOSK_EVENTS.CANCEL_PHOTO]: (data) => {
				console.log('Cancel photo received:', data);
				triggerHaptic('light');
				onRetake();
			},
			[KIOSK_EVENTS.PHOTO_DECISION]: (data) => {
				if (hasSubmitted.current) return;
				console.log('Cancel photo received:', data);
				handleContinue();
			},
			[KIOSK_EVENTS.RETAKE_PHOTO]: () => {
				console.log('RETAKE_PHOTO received');
				triggerHaptic('light');
				onRetake();
			},
		},
	});

	if (!url) return null;

	return (
		<div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#1C4639] px-4 py-8">
			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
				alt="ONER"
				className="h-20 w-auto mb-8"
			/>
			<div className="border-8 w-full h-full flex items-center justify-center flex-col border-white bg-white">
				<img
					src={url}
					alt="Your captured selfie"
					className="block object-cover w-full h-[80%]"
				/>
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/lockup-green.svg"
					alt="ONER"
					className="h-20 w-auto mx-auto mt-auto mb-auto"
				/>
			</div>
			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
				alt="ONER"
				className="h-14 w-auto mt-8"
			/>
		</div>
	);
}
