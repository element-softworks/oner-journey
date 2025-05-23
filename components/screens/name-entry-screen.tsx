'use client';

import { useState, useRef } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/user-context';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { validateName } from '@/lib/validators';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

interface NameEntryScreenProps {
	onNavigate: (screen: AppScreen, params?: string[]) => void;
}

export function NameEntryScreen({ onNavigate }: NameEntryScreenProps) {
	const { userData, updateName } = useUser();
	const [name, setName] = useState(userData.name || '');
	const [error, setError] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const trackEvent = useTrackEvent();
	const { triggerHaptic } = useHapticFeedback();

	const keyboardRef = useRef<any>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setName(value);
		if (keyboardRef.current) keyboardRef.current.setInput(value);
		if (value.trim() !== '') setError('');
	};

	const onKeyboardChange = (input: string) => {
		setName(input);
		if (inputRef.current) inputRef.current.value = input;
	};

	const handleContinue = () => {
		if (!validateName(name)) {
			setError('Please enter your name to continue');
			triggerHaptic('error');
			return;
		}

		trackEvent('build-your-fit-name', 'submit-name-form', [{ key: 'name', value: name }]);
		updateName(name);
		triggerHaptic('success');
		onNavigate('email', [`name=${name}`]);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		console.log('Key pressed:', e.key);
		if (e.key === 'Enter') handleContinue();
	};

	return (
		<div className="h-full">
			{isFocused && (
				<div
					className="absolute inset-0  z-40 w-full"
					onClick={() => {
						setIsFocused(false);
					}}
				/>
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
							GET READY
						</h1>
						<p className="text-xl lg:text-2xl font-regular text-white mb-2">
							Please enter your name below
						</p>
					</div>

					<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
						<div className="space-y-2 text-white w-full">
							<Input
								ref={inputRef}
								id="name"
								placeholder="Enter first and last name"
								value={name}
								onChange={handleNameChange}
								onKeyDown={handleKeyDown}
								autoFocus
								onFocus={() => setIsFocused(true)}
								onBlur={() => {}}
								className={`h-12 ${error ? 'border-red-500' : ''} text-black`}
							/>
							{error && <p className="text-red-500 text-xs">{error}</p>}
						</div>

						<Button
							onClick={handleContinue}
							className="mx-auto !mt-8 h-12 rounded-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 w-fit px-6"
						>
							NEXT
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
						onKeyPress={(key, e) => {
							if (key === '{enter}') {
								handleContinue();
							}
						}}
						keyboardRef={(r) => (keyboardRef.current = r)}
						onChange={onKeyboardChange}
						inputName="default"
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
