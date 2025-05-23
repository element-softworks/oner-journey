'use client';

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, KIOSK_EVENTS, MOBILE_EVENTS } from '@/lib/socket-events';
import { supabase } from '@/lib/supabase';
import { useRef, useState } from 'react';

interface PhotoBoothDetailsProps {
	onNavigate: (
		screen: PhotoBoothScreen,
		data?: { blob?: Blob; email?: string; name?: string }
	) => void;
	sessionId: string;
}

export function PhotoBoothDetails({ onNavigate, sessionId }: PhotoBoothDetailsProps) {
	const photoSent = useRef(false);
	// 2) Join the socket as a kiosk, watch for mobile arrival
	const { socket } = useSocketRoom({
		sessionId: sessionId,
		role: DEVICE_TYPE.KIOSK,
		handlers: {
			// A) Confirm that *this* kiosk has joined its room
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log(`Kiosk joined room ${sessionId}`);
			},
			[MOBILE_EVENTS.DETAILS]: async (data) => {
				console.log(`Details event listened ${sessionId} ${data?.email} ${data?.name}`);

				onNavigate('capture', { email: data.email, name: data.name });
			},
		},
	});

	return (
		<div className="relative w-full h-screen">
			<div className="w-full z-20 relative h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
				<div className="absolute inset-0 bg-black/60 w-full h-full z-20" />

				<video
					className="w-full h-full object-cover z-10 absolute top-0 left-0"
					playsInline
					muted
					loop
					autoPlay
					preload="auto"
				>
					<source src="/videos/think-live-video.mp4" type="video/mp4" />
					Sorry, your browser doesn’t support embedded videos.
				</video>
				<div className="w-full max-w-md   z-20">
					<div className="space-y-6">
						<div className="text-start mb-8">
							<ol className="flex flex-col gap-4 uppercase">
								<li className="text-2xl text-white">
									1. Use your phone to enter your details.
								</li>
								<li className="text-2xl text-white">
									2. Ok, you're ALL SET to use the MIRROR - now find your best
									angles!
								</li>

								<li className="text-2xl text-white">
									3. Ready? On your phone, press Take Photo’.
								</li>
								<li className="text-2xl text-white">
									4. Strike a pose and wait for the countdown.
								</li>
								<li className="text-2xl text-white">
									5. Send your photo to your email or try a retake.
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
