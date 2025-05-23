'use client';

import React, { useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useToast } from '@/hooks/use-toast';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { validateEmail } from '@/lib/validators';
import { Loader2 } from 'lucide-react';

interface EmailEntryScreenProps {
	onNavigate: (screen: AppScreen, params?: string[]) => void;
	searchParams?: Record<string, string>;
}

export function EmailEntryScreen({ onNavigate, searchParams }: EmailEntryScreenProps) {
	const { userData, updateEmail } = useUser();
	const [email, setEmail] = useState(userData.email || '');
	const [error, setError] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const trackEvent = useTrackEvent();
	const { triggerHaptic } = useHapticFeedback();
	const { toast } = useToast();

	const keyboardRef = useRef<any>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);
		if (keyboardRef.current) keyboardRef.current.setInput(value);
		if (value.trim() !== '') setError('');
	};

	const onKeyboardChange = (input: string) => {
		setEmail(input);
		if (inputRef.current) inputRef.current.value = input;
	};

	const handleSubmit = async () => {
		if (!validateEmail(email)) {
			setError('Please enter a valid email address');
			triggerHaptic('error');
			return;
		}

		try {
			setIsSubmitting(true);
			triggerHaptic('medium');

			trackEvent('build-your-fit-email', 'submit-email-form', [
				{ key: 'email', value: email },
			]);

			updateEmail(email);
			triggerHaptic('success');

			toast({
				title: 'Email Registered',
				description: `Welcome ${userData.name}! Let\'s find your perfect fit.`,
			});

			onNavigate('products', [
				`email=${encodeURIComponent(email)}`,
				`name=${encodeURIComponent(searchParams?.name || '')}`,
			]);
		} catch (err) {
			triggerHaptic('error');
			toast({
				title: 'Registration Failed',
				description: 'Please try again later',
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isSubmitting) {
			handleSubmit();
		}
	};

	return (
		<div className="h-full">
			{isFocused && (
				<div className="absolute inset-0 z-40 w-full" onClick={() => setIsFocused(false)} />
			)}
			<div className="relative flex flex-col h-full bg-[#5B7FCA] p-6 md:py-16 max-w-2xl mx-auto">
				<div className="flex justify-center flex-1">
					<img
						src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
						alt="ONER"
						className="h-20 w-auto"
					/>
				</div>

				<div>
					<div className="text-center mb-8">
						<h1 className="text-5xl lg:text-7xl font-semibold text-white mb-2">
							ALMOST THERE
						</h1>
						<p className="text-xl lg:text-2xl font-regular text-white mb-2">
							Please enter your email address below
						</p>
					</div>

					<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
						<div className="space-y-2 text-white w-full">
							<Input
								ref={inputRef}
								id="email"
								type="email"
								placeholder="Enter your email address"
								value={email}
								onChange={handleEmailChange}
								onKeyDown={handleKeyDown}
								autoComplete="email"
								disabled={isSubmitting}
								autoFocus
								onFocus={() => setIsFocused(true)}
								className={`h-12 ${error ? 'border-red-500' : ''} text-black`}
							/>
							{error && <p className="text-red-500 text-xs">{error}</p>}
						</div>

						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="mx-auto !mt-8 h-12 rounded-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									SUBMITTING...
								</>
							) : (
								<>NEXT</>
							)}
						</Button>
					</div>
				</div>

				<div
					className="absolute bottom-20 z-50 left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-out"
					style={{
						transform: isFocused
							? 'translateY(-40%) scale(1.5)'
							: 'translateY(150%) scale(1.5)',
						transformOrigin: 'top center',
					}}
				>
					<Keyboard
						onKeyDown={handleKeyDown}
						onKeyPress={(key) => {
							if (key === '{enter}') handleSubmit();
						}}
						keyboardRef={(r) => (keyboardRef.current = r)}
						onChange={onKeyboardChange}
					/>
				</div>

				<div className="flex-1 flex items-end justify-center">
					<img
						src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/logo-think.svg"
						alt="ONER"
						className="h-14 w-auto"
					/>
				</div>
			</div>
		</div>
	);
}
