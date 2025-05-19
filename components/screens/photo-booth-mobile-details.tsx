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

interface Props {
	onNavigate: (screen: PhotoBoothMobileScreen) => void;
}

export function PhotoBoothMobileDetails({ onNavigate }: Props) {
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
		<div className="flex flex-col h-full bg-white p-6">
			<div className="flex justify-center mb-8">
				<img
					src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
					alt="ONER"
					className="h-8 w-auto"
				/>
			</div>

			<div className="text-center mb-8">
				<h1 className="text-xl font-bold mb-2">WELCOME TO THE PHOTO BOOTH</h1>
				<p className="text-sm">TO TAKE A PHOTO ENTER DETAILS BELOW</p>
			</div>

			<div className="space-y-6">
				{/* Name field */}
				<div className="space-y-2">
					<Label htmlFor="name" className="text-sm">
						NAME
					</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={`h-12 ${nameError ? 'border-red-500' : ''}`}
					/>
					{nameError && <p className="text-red-500 text-xs">{nameError}</p>}
				</div>

				{/* Email field */}
				<div className="space-y-2">
					<Label htmlFor="email" className="text-sm">
						EMAIL
					</Label>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`h-12 ${emailError ? 'border-red-500' : ''}`}
					/>
					{emailError && <p className="text-red-500 text-xs">{emailError}</p>}
				</div>

				{/* Submit */}
				<Button
					onClick={handleSubmit}
					disabled={!ready}
					className="w-full h-12 bg-black text-white hover:bg-gray-900 disabled:opacity-50"
				>
					{ready ? 'TAKE A PHOTO' : 'CONNECTING…'}
				</Button>
			</div>
		</div>
	);
}
