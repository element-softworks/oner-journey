'use client';

import { Button } from '@/components/ui/button';
import { useSocketRoom } from '@/hooks/use-socket';
import { toast } from '@/hooks/use-toast';
import { CORE_EVENTS, DEVICE_TYPE, MOBILE_EVENTS } from '@/lib/socket-events';
import { useState } from 'react';

interface PhotoBoothMobilePreviewProps {
	onAccept: () => void;
	onRetake: () => void;
	onCancel: () => void;
	sessionId: string;
}

export function PhotoBoothMobilePreview({
	onAccept,
	onRetake,
	onCancel,
	sessionId,
}: PhotoBoothMobilePreviewProps) {
	const [ready, setReady] = useState(false);
	const { socket } = useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.MOBILE,
		handlers: {
			// server sent joined_room → we can enable UI
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Mobile joined room ${sessionId}`);
				setReady(true);
			},
			// server-side error
			[CORE_EVENTS.ERROR]: (err: string) => {
				console.error('Socket error', err);
				toast({ title: 'Socket error', description: err, variant: 'destructive' });
			},
		},
	});

	const handleRetakePhoto = () => {
		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…' });
			return;
		}

		// 4) Emit mobile_details into the room
		socket.emit(MOBILE_EVENTS.TAKE_PHOTO, { cancel: true });
		onRetake();
	};
	const handleAccept = () => {
		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…' });
			return;
		}

		// 4) Emit mobile_details into the room
		socket.emit(MOBILE_EVENTS.PHOTO_DECISION, { decision: true });
		onAccept();
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

			<div className="flex-1 flex flex-col space-y-4">
				<Button
					onClick={handleAccept}
					className="w-full h-12 bg-black text-white hover:bg-gray-900"
				>
					ACCEPT
				</Button>

				<Button variant="outline" onClick={handleRetakePhoto}>
					RETAKE PHOTO
				</Button>
			</div>
		</div>
	);
}
