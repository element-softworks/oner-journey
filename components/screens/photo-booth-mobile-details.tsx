'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateName, validateEmail } from '@/lib/validators';
import { useToast } from '@/hooks/use-toast';
import { PhotoBoothMobileScreen } from './photo-booth-mobile-container';

interface PhotoBoothMobileDetailsProps {
	onNavigate: (screen: PhotoBoothMobileScreen) => void;
}

export function PhotoBoothMobileDetails({ onNavigate }: PhotoBoothMobileDetailsProps) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const { toast } = useToast();

	const handleSubmit = () => {
		let isValid = true;

		if (!validateName(name)) {
			setNameError('Please enter your name');
			isValid = false;
		} else {
			setNameError('');
		}

		if (!validateEmail(email)) {
			setEmailError('Please enter a valid email address');
			isValid = false;
		} else {
			setEmailError('');
		}

		if (isValid) {
			onNavigate('capture');
		}
	};

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

				<Button
					onClick={handleSubmit}
					className="w-full h-12 bg-black text-white hover:bg-gray-900"
				>
					TAKE A PHOTO
				</Button>
			</div>
		</div>
	);
}
