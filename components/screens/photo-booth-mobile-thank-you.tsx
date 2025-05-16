'use client';

import { Button } from '@/components/ui/button';

export function PhotoBoothMobileThankYou() {
	return (
		<div className="flex flex-col h-full bg-white">
			<div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
				<div className="flex justify-center items-start p-4 mb-auto">
					<img
						src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
						alt="ONER"
						className="h-8 w-auto  "
					/>
				</div>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
					<p className="text-gray-600">
						Your photo has now been sent to your email address!
					</p>
				</div>

				<Button
					onClick={() => (window.location.href = 'https://www.oneractive.com')}
					className="w-full mt-auto h-12 bg-black text-white hover:bg-gray-900"
				>
					VISIT ONER ACTIVE WEBSITE
				</Button>
			</div>
		</div>
	);
}
