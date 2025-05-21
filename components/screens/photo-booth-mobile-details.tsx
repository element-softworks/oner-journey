'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateName, validateEmail } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';

import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, MOBILE_EVENTS, DEVICE_TYPE } from '@/lib/socket-events';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

interface Props {
	onNavigate: (screen: PhotoBoothMobileScreen) => void;
}

export function PhotoBoothMobileDetails({ onNavigate }: Props) {
	const trackEvent = useTrackEvent();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [ready, setReady] = useState(false);
	const { toast } = useToast();

	// 1) Grab sessionId from query string
	const searchParams = useSearchParams();
	const sessionId = searchParams?.get('sessionId') ?? '';

	// 2) Kick off socket & join the room
	const { socket } = useSocketRoom({
		sessionId,
		role: DEVICE_TYPE.MOBILE,
		handlers: {
			// server sent joined_room → we can enable UI
			[CORE_EVENTS.JOINED_ROOM]: () => {
				console.log('Joined room', sessionId);
				setReady(true);
			},
			// server-side error
			[CORE_EVENTS.ERROR]: (err: string) => {
				console.error('Socket error', err);
				toast({ title: 'Socket error', description: err, variant: 'destructive' });
			},
			// optional: kiosk cancelled before camera? could navigate back
			[MOBILE_EVENTS.TAKE_PHOTO]: () => {
				/* unlikely here, mobile never listens to its own TAKE_PHOTO */
			},
		},
	});

	// 3) Form submit
	const handleSubmit = useCallback(() => {
		let valid = true;
		if (!validateName(name)) {
			setNameError('Please enter your name');
			valid = false;
		} else {
			setNameError('');
		}
		if (!validateEmail(email)) {
			setEmailError('Please enter a valid email address');
			valid = false;
		} else {
			setEmailError('');
		}
		if (!valid) return;

		if (!socket || !ready) {
			toast({ title: 'Not ready', description: 'Still connecting…', variant: 'warning' });
			return;
		}

		trackEvent('photo-booth-mobile-details', 'submit-details-form', [
			{
				key: 'name',
				value: name,
			},
			{
				key: 'email',
				value: email,
			},
		]);

		// 4) Emit mobile_details into the room
		socket.emit(MOBILE_EVENTS.DETAILS, { sessionId, name, email });
		onNavigate('capture');
	}, [socket, ready, sessionId, name, email, toast, onNavigate]);

	// If sessionId is missing, you might want to redirect or show an error
	useEffect(() => {
		if (!sessionId) {
			toast({
				title: 'Missing session',
				description: 'Please scan the QR code again.',
				variant: 'destructive',
			});
		}
	}, [sessionId, toast]);

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
				<div className="text-center mb-8">
					<h1 className="text-xl lg:text-xl font-semibold text-white mb-2">WELCOME</h1>
					<p className="text-xl lg:text-xl font-semibold text-white mb-2">
						TAKE A PHOTO AND ENTER YOUR DETAILS BELOW
					</p>
				</div>

				<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
					{/* Name field */}
					<div className="space-y-2 text-white w-full">
						<Label htmlFor="name" className="text-sm">
							NAME
						</Label>
						<Input
							id="name"
							placeholder="Enter your name"
							text-white
							value={name}
							onChange={(e) => setName(e.target.value)}
							className={`h-12 ${nameError ? 'border-red-500' : ''} text-black`}
						/>
						{nameError && <p className="text-red-500 text-xs">{nameError}</p>}
					</div>

					{/* Email field */}
					<div className="space-y-2 w-full">
						<Label htmlFor="email" className="text-sm">
							EMAIL
						</Label>
						<Input
							placeholder="Enter your email"
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`h-12 ${emailError ? 'border-red-500' : ''} text-black`}
						/>
						{emailError && <p className="text-red-500 text-xs">{emailError}</p>}
					</div>

					{/* Submit */}
					<Button
						onClick={handleSubmit}
						disabled={!ready}
						className="mx-auto  h-12 rounded-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
					>
						{ready ? 'TAKE A PHOTO' : 'CONNECTING…'}
					</Button>
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
