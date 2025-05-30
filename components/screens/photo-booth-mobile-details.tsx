'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateName, validateEmail, validateLastName } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';

import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, MOBILE_EVENTS, DEVICE_TYPE } from '@/lib/socket-events';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { supabase } from '@/lib/supabase';

interface Props {
	onNavigate: (screen: PhotoBoothMobileScreen) => void;
}

export function PhotoBoothMobileDetails({ onNavigate }: Props) {
	const trackEvent = useTrackEvent();
	const [name, setName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [nameError, setNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [ready, setReady] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

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
	const handleSubmit = useCallback(async () => {
		let valid = true;
		if (!validateName(name)) {
			setNameError('Please enter your name');
			valid = false;
		} else {
			setNameError('');
		}

		if (!validateLastName(lastName)) {
			setLastNameError('Please enter your last name');
			valid = false;
		} else {
			setLastNameError('');
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
				value: `${name} ${lastName}`,
			},
			{
				key: 'email',
				value: email,
			},
		]);

		const { error: dbError } = await supabase.from('oner_data').insert({
			email: email,
			raw: {
				type: 'photo_booth',
				name: name,
				sessionId: sessionId,
				timestamp: new Date().toISOString(),
			},
		});

		// 4) Emit mobile_details into the room
		socket.emit(MOBILE_EVENTS.DETAILS, { sessionId, name: `${name} ${lastName}`, email });
		onNavigate('capture');
	}, [socket, ready, sessionId, name, email, toast, onNavigate, lastName]);

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

		router.push(
			'https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY'
		);
	};

	return (
		<div className="flex flex-col min-h-[100dvh] w-full gap-2 mx-auto bg-[#1C4639] p-6 md:md:py-16 max-w-2xl">
			<div className="flex justify-center flex-1">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
					alt="ONER"
					className="h-20 w-auto mb-4"
				/>
			</div>

			<form autoComplete="off" onSubmit={(e) => e.preventDefault()} className="">
				<div className="text-center mb-8">
					<h1 className="text-xl lg:text-xl font-semibold text-white mb-">WELCOME</h1>
					<p className="text-xl lg:text-xl font-semibold text-white mb-2">
						TAKE A PHOTO AND ENTER YOUR DETAILS BELOW
					</p>
				</div>

				<div className="space-y-6 flex flex-col items-center justify-center w-full mx-auto">
					{/* Name field */}

					<div className="flex flex-row gap-6 w-full">
						<div className="space-y-2  flex-1">
							<Label htmlFor="name" className="text-sm text-white">
								First name
							</Label>
							<Input
								id="name"
								autoFocus
								placeholder="First name"
								text-white
								value={name}
								onChange={(e) => setName(e.target.value)}
								className={`h-12 text-lg ${
									nameError ? 'border-red-500' : ''
								} !text-black`}
							/>
							{nameError && <p className="text-red-500 text-xs">{nameError}</p>}
						</div>
						<div className="space-y-2  flex-1">
							<Label htmlFor="name" className="text-sm text-white">
								Last name
							</Label>
							<Input
								id="name"
								placeholder="Last name"
								text-white
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className={`h-12 text-lg ${
									lastNameError ? 'border-red-500' : ''
								} !text-black`}
							/>
							{lastNameError && (
								<p className="text-red-500 text-xs">{lastNameError}</p>
							)}
						</div>
					</div>

					{/* Email field */}
					<div className="space-y-2 w-full">
						<Label htmlFor="email" className="text-sm text-white">
							Email address
						</Label>
						<Input
							placeholder="Enter your email"
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={`h-12 text-lg ${
								emailError ? 'border-red-500' : ''
							} !text-black`}
						/>
						{emailError && <p className="text-red-500 text-xs">{emailError}</p>}
					</div>

					{/* Submit */}
					<div className="flex flex-row gap-4 items-center">
						<Button
							type="button"
							onClick={handleCancel}
							variant="outline"
							className="mx-auto  h-12 rounded-full bg-transparent border-white border-2 hover:text-gray-100 hover:border-gray-100 text-white hover:bg-transparent disabled:opacity-50 w-full px-6"
						>
							CANCEL
						</Button>
						<Button
							type="submit"
							onClick={handleSubmit}
							disabled={!ready}
							className="mx-auto  h-12 rounded-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
						>
							{ready ? 'TAKE A PHOTO' : 'CONNECTING…'}
						</Button>
					</div>
				</div>
			</form>
			<div className="flex-1 flex items-end justify-center !mt-4 ">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
					alt="ONER"
					className="h-14 w-auto"
				/>
			</div>
		</div>
	);
}
