'use client';

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useSocketRoom } from '@/hooks/use-socket';
import { useToast } from '@/hooks/use-toast';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS } from '@/lib/socket-events';
import { blobToBase64 } from '@/lib/utils';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * @description Creates a jpeg image from a html div element
 * @param {HTMLDivElement} element
 * @returns {Blob}
 */
function elementToBlob(element: HTMLDivElement): Promise<Blob | null> {
	return new Promise(async (resolve) => {
		try {
			const canvas = await html2canvas(element, { width: 480, height: 660 });
			canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 1);
		} catch (error) {
			return resolve(null);
		}
	});
}

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
	const photoContainer = useRef<HTMLDivElement>(null);

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
		let photoPayload = null;

		// We always want a fallback of just the photo, in case we couldn't get anything else
		if (photoContainer.current !== null) {
			const wrapped = await elementToBlob(photoContainer.current);
			if (wrapped) {
				photoPayload = wrapped;
			} else {
				photoPayload = photo;
			}
		} else {
			photoPayload = photo;
		}

		console.log('submitting photo', photo, email, name, photo);
		if (!email || hasSubmitted.current || !photoPayload) return;
		triggerHaptic('medium');
		hasSubmitted.current = true;

		const base64 = await blobToBase64(photoPayload);

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

	const CAMERA_TRANSFORM = `rotate(${process.env.NEXT_PUBLIC_CAMERA_ROTATION})`;

	return (
		<div className="relative flex h-screen mx-auto max-w-3xl flex-col items-center justify-center bg-[#1C4639] px-4 py-16">
			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
				alt="ONER"
				className="h-60 w-auto mb-auto"
			/>
			<div
				className="border-8 w-full aspect-[2/2.75] flex items-center justify-center flex-col border-white bg-white"
				ref={photoContainer}
			>
				<div style={{ transform: CAMERA_TRANSFORM }}>
					<img
						src={url}
						alt="Your captured selfie"
						className="block object-cover w-full aspect-square"
					/>
				</div>
				<img
					width={150}
					height={80}
					src="/images/oner-green.svg"
					alt="ONER"
					className="h-20 min-w-[148px] min-h-[80px] w-auto mx-auto mt-auto mb-auto"
				/>
			</div>
			<img
				src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
				alt="ONER"
				className="h-32 w-auto mt-auto"
			/>
		</div>
	);
}
