'use client';

import { Button } from '@/components/ui/button';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, MOBILE_EVENTS, KIOSK_EVENTS } from '@/lib/socket-events';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { EventEmitter } from 'events';

interface PhotoBoothMobileCaptureProps {
	onNavigate: (screen: PhotoBoothMobileScreen, data?: { blob?: Blob }) => void;
	onCancel: () => void;
	sessionId: string;
}

export function PhotoBoothMobileCapture({
	onNavigate,
	onCancel,
	sessionId,
}: PhotoBoothMobileCaptureProps) {
	const [ready, setReady] = useState(false);
	const [takingPhoto, setTakingPhoto] = useState(false);

	const { socket } = useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.MOBILE,
		handlers: {
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Mobile joined room ${sessionId}`);
				setReady(true);
			},
			[CORE_EVENTS.ERROR]: (err: string) => {
				console.error('Socket error', err);
				toast({ title: 'Socket error', description: err, variant: 'destructive' });
			},
		},
	});

	useEffect(() => {
		if (!socket) return;

		// Safely increase max listeners using EventEmitter
		if (socket instanceof EventEmitter) {
			socket.setMaxListeners(20);
		}

		return () => {
			// Reset on cleanup
			if (socket instanceof EventEmitter) {
				socket.setMaxListeners(10);
			}
		};
	}, [socket]);

	const handleTakePhoto = () => {
		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…', variant: 'warning' });
			return;
		}
		setTakingPhoto(true);

		socket.emit(MOBILE_EVENTS.TAKE_PHOTO, { cancel: false });

		setTimeout(() => {
			onNavigate('preview');
		}, 3000);
	};

	const handleCancel = () => {
		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…', variant: 'warning' });
			return;
		}

		socket.emit(KIOSK_EVENTS.MOBILE_JOINED);
		// onCancel();
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
				{takingPhoto ? (
					<div>
						<p className="text-gray-900 text-center">Taking photo...</p>
						<div className="mt-4 mx-auto w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
					</div>
				) : (
					<>
						<Button
							onClick={handleTakePhoto}
							className="w-full h-12 bg-black text-white hover:bg-gray-900"
						>
							TAKE PHOTO
						</Button>
						{/* <Button
							onClick={handleCancel}
							variant="outline"
							className="w-full h-12 border-2"
						>
							CANCEL
						</Button> */}
					</>
				)}
			</div>
		</div>
	);
}
