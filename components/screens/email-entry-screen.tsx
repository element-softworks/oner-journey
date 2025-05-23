'use client';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useToast } from '@/hooks/use-toast';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { validateEmail } from '@/lib/validators';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface EmailEntryScreenProps {
	onNavigate: (screen: AppScreen, params?: string[]) => void;
	searchParams?: any;
}

export function EmailEntryScreen({ onNavigate, searchParams }: EmailEntryScreenProps) {
	const { userData, updateEmail } = useUser();
	const [email, setEmail] = useState(userData.email);
	const [error, setError] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { triggerHaptic } = useHapticFeedback();
	const { toast } = useToast();
	const trackEvent = useTrackEvent();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEmail(value);

		if (value.trim() !== '') {
			setError('');
		}
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

			// Simulate API call

			trackEvent('build-your-fit-email', 'submit-email-form', [
				{
					key: 'email',
					value: email,
				},
			]);

			updateEmail(email);
			triggerHaptic('success');

			toast({
				title: 'Email Registered',
				description: `Welcome ${userData.name}! Let's find your perfect fit.`,
			});

			onNavigate('products', [`email=${email}`, `name=${searchParams?.name}`]);
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
		<div className="flex flex-col h-full bg-[#5B7FCA] p-6 py-16 max-w-2xl mx-auto">
			<div className="flex justify-center flex-1">
				<img
					src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
					alt="ONER"
					className="h-20 w-auto"
				/>
			</div>

			<div>
				<div className="text-center mb-8">
					<h1 className="text-5xl lg:text-5xl font-semibold text-white mb-2">
						ALMOST THERE
					</h1>
					<p className="text-xl lg:text-xl font-regular text-white mb-2">
						Please enter your email address below
					</p>
				</div>

				<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
					{/* Name field */}
					<div className="space-y-2 text-white w-full">
						<Input
							onChange={handleEmailChange}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							id="name"
							placeholder="Enter your email address"
							value={email}
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

{
	/* <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
	<div className="w-full  bg-white p-8 rounded-2xl shadow-lg">
		<div className="flex justify-center mb-8">
			<img
				src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
				alt="ONER"
				className="h-12 w-auto"
			/>
		</div>

		<div className="space-y-6">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">One Last Step</h1>
				<p className="text-gray-600">How can we reach you?</p>
			</div>

			<div className="space-y-3">
				<Label
					htmlFor="email"
					className={`text-sm transition-colors duration-200 ${
						error ? 'text-red-500' : 'text-gray-600'
					}`}
				>
					{error || 'Your Email'}
				</Label>

				<div
					className={`relative border-b-2 transition-colors duration-300 ${
						error ? 'border-red-500' : isFocused ? 'border-gray-900' : 'border-gray-200'
					}`}
				>
					<Input
						id="email"
						type="email"
						value={email}
						onChange={handleEmailChange}
						onKeyDown={handleKeyDown}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						placeholder="Enter your email address"
						className="bg-transparent border-0 text-gray-900 text-lg h-14 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
						autoComplete="email"
						disabled={isSubmitting}
					/>
				</div>
			</div>

			<p className="text-xs text-gray-500 mt-2">
				By submitting your email, you agree to our{' '}
				<a href="#" className="underline hover:text-gray-700">
					Privacy Policy
				</a>
			</p>

			<Button
				onClick={handleSubmit}
				disabled={isSubmitting}
				className="w-full h-14 mt-6 bg-gray-900 text-white hover:bg-gray-800 group"
			>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						<span>Submitting...</span>
					</>
				) : (
					<>
						<span>Submit</span>
						<ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
					</>
				)}
			</Button>
		</div>
	</div>
</div>; */
}
