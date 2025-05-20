'use client';

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface PhotoBoothThankYouProps {
	onNavigate: (screen: PhotoBoothScreen) => void;
}

export function PhotoBoothThankYou({ onNavigate }: PhotoBoothThankYouProps) {
	const { triggerHaptic } = useHapticFeedback();

	const handleFinish = () => {
		triggerHaptic('success');
		onNavigate('landing');
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			window.location.href = '/';
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

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

				<div className="space-y-6 text-center">
					<div className="flex justify-center">
						<div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
							<Check className="h-10 w-10 text-green-600" />
						</div>
					</div>

					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
						<p className="text-gray-600">Thanks for using our photo booth!</p>
					</div>
				</div>
			</div>
		</div>
	);
}
