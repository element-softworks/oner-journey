'use client';

import { Button } from '@/components/ui/button';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, MOBILE_EVENTS, KIOSK_EVENTS } from '@/lib/socket-events';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { EventEmitter } from 'events';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

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
	const trackEvent = useTrackEvent();

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

		trackEvent('photo-booth-capture', 'take-photo', [
			{
				key: 'photo',
				value: 'take',
			},
		]);

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

		trackEvent('photo-booth-capture', 'cancel-photo', [
			{
				key: 'photo',
				value: 'cancel',
			},
		]);

		socket.emit(MOBILE_EVENTS.TAKE_PHOTO, { cancel: true });
		onCancel();
	};

	return (
		<div className="flex flex-col h-full bg-[#1C4639] p-6 md:py-16">
			<div className="flex justify-center flex-1">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
					alt="ONER"
					className="h-40 w-auto"
				/>
			</div>

			<div>
				<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
					<div className="flex-1 flex flex-col items-center  space-y-4">
						{takingPhoto ? (
							<div>
								<p className="text-white text-center">TAKING PHOTO...</p>
								<div className="mt-4 mx-auto w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
							</div>
						) : (
							<div className="flex flex-col items-center gap-6">
								<Button
									onClick={handleTakePhoto}
									className="mx-auto  h-14 rounded-full text-xl bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
								>
									TAKE PHOTO
								</Button>
								<Button
									onClick={handleCancel}
									variant="outline"
									className="mx-auto text-xl h-14 rounded-full bg-transparent border-white border-2 hover:text-gray-100 hover:border-gray-100 text-white hover:bg-transparent disabled:opacity-50 w-full px-6"
								>
									CANCEL
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="flex-1 flex items-end justify-center ">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
					alt="ONER"
					className="h-28 w-auto"
				/>
			</div>
		</div>
	);
}
