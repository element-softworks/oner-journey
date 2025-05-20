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

		socket.emit(MOBILE_EVENTS.PHOTO_DECISION, { decision: true, retake: true });
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

	const handleCancel = () => {
		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…' });
			return;
		}

		socket.emit(MOBILE_EVENTS.PHOTO_DECISION, { decision: false });
		onCancel();
	};

	return (
		<div className="flex flex-col h-full bg-[#1C4639] p-6 py-16">
			<div className="flex justify-center flex-1">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
					alt="ONER"
					className="h-20 w-auto"
				/>
			</div>

			<div>
				<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
					<div className="flex-1 flex flex-col items-center  space-y-4">
						<div className="flex flex-col items-center gap-6">
							<Button
								onClick={handleAccept}
								className="mx-auto w-full h-14 rounded-full text-xl bg-white text-black hover:bg-gray-100 disabled:opacity-50 px-6"
							>
								GET MY PHOTO
							</Button>
							<Button
								onClick={handleRetakePhoto}
								variant="default"
								className="mx-auto w-full h-14 rounded-full text-xl bg-white text-black hover:bg-gray-100 disabled:opacity-50 px-6"
							>
								RETAKE
							</Button>
							<Button
								onClick={handleCancel}
								variant="outline"
								className="mx-auto text-xl h-14 rounded-full bg-transparent border-white border-2 hover:text-gray-100 hover:border-gray-100 text-white hover:bg-transparent disabled:opacity-50 w-full px-6"
							>
								CANCEL
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex-1 flex items-end justify-center ">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
					alt="ONER"
					className="h-14 w-auto"
				/>
			</div>
		</div>
	);
}
