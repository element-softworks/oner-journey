'use client';

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS, MOBILE_EVENTS } from '@/lib/socket-events';

interface PhotoBoothDetailsProps {
	onNavigate: (
		screen: PhotoBoothScreen,
		data?: { blob?: Blob; email?: string; name?: string }
	) => void;
	sessionId: string;
}

export function PhotoBoothDetails({ onNavigate, sessionId }: PhotoBoothDetailsProps) {
	// 2) Join the socket as a kiosk, watch for mobile arrival
	const { socket } = useSocketRoom({
		sessionId: sessionId,
		role: DEVICE_TYPE.KIOSK,
		handlers: {
			// A) Confirm that *this* kiosk has joined its room
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Kiosk joined room ${sessionId}`);
			},
			[MOBILE_EVENTS.DETAILS]: (data) => {
				console.log(`Details event listened ${sessionId} ${data?.email} ${data?.name}`);
				onNavigate('capture', { email: data.email, name: data.name });
			},
		},
	});

	return (
		<div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
			<div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
				<div className="flex justify-center mb-8">
					<img
						src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
						alt="ONER"
						className="h-12 w-auto"
					/>
				</div>

				<div className="space-y-6">
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							USE YOUR PHONE TO ENTER YOUR DETAILS
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
}
