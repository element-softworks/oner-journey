'use client';

import { useState } from 'react';
import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { validateName } from '@/lib/validators';
import { ArrowRight } from 'lucide-react';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

interface NameEntryScreenProps {
	onNavigate: (screen: AppScreen) => void;
}

export function NameEntryScreen({ onNavigate }: NameEntryScreenProps) {
	const { userData, updateName } = useUser();
	const [name, setName] = useState(userData.name);
	const trackEvent = useTrackEvent();

	const [error, setError] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const { triggerHaptic } = useHapticFeedback();

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setName(value);

		if (value.trim() !== '') {
			setError('');
		}
	};

	const handleContinue = () => {
		if (!validateName(name)) {
			setError('Please enter your name to continue');
			triggerHaptic('error');
			return;
		}

		trackEvent('build-your-fit-name', 'submit-name-form', [
			{
				key: 'name',
				value: name,
			},
		]);

		updateName(name);
		triggerHaptic('success');
		onNavigate('email');
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleContinue();
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
						GET READY
					</h1>
					<p className="text-xl lg:text-xl font-regular text-white mb-2">
						Please enter your name below
					</p>
				</div>

				<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
					{/* Name field */}
					<div className="space-y-2 text-white w-full">
						<Input
							onChange={handleNameChange}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							id="name"
							placeholder="Enter first and last name"
							value={name}
							className={`h-12 ${error ? 'border-red-500' : ''} text-black`}
						/>
						{error && <p className="text-red-500 text-xs">{error}</p>}
					</div>

					{/* Submit */}
					<Button
						onClick={handleContinue}
						className="mx-auto !mt-8 h-12 rounded-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
					>
						NEXT
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
