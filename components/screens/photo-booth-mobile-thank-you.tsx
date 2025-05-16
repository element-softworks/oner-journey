'use client';

import { Button } from '@/components/ui/button';

export function PhotoBoothMobileThankYou() {
	return (
		<div className="flex flex-col h-full bg-white">
			<div className="flex justify-center p-4">
				<img
					src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
					alt="ONER"
					className="h-8 w-auto"
				/>
			</div>

			<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
				<h1 className="text-2xl font-bold mb-4">THANK YOU</h1>
				<p className="mb-8">YOUR PHOTO HAS NOW BEEN SENT TO YOUR EMAIL ADDRESS</p>

				<Button
					onClick={() => (window.location.href = 'https://www.oneractive.com')}
					className="w-full h-12 bg-black text-white hover:bg-gray-900"
				>
					VISIT ONER ACTIVE WEBSITE
				</Button>
			</div>
		</div>
	);
}
