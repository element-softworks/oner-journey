'use client';

import { Button } from '@/components/ui/button';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

export function PhotoBoothMobileThankYou() {
	const trackEvent = useTrackEvent();

	return (
		<div className="flex flex-col h-full bg-white">
			<div className="flex flex-col h-full bg-[#1C4639] p-6 md:py-16">
				<div className="flex justify-center flex-1">
					<img
						src="https://merlin-cloud.s3.eu-west-2.amazonaws.com/LOCKUP.svg"
						alt="ONER"
						className="h-20 w-auto"
					/>
				</div>

				<div>
					<div className="space-y-6 text-white flex flex-col items-center justify-center w-full mx-auto">
						<div className="flex-1 flex flex-col items-center  space-y-4">
							<div className="flex flex-col items-center gap-4">
								<p className="z-[50] text-white text-center text-4xl lg:text-5xl font-bold  ">
									THANK YOU
								</p>
								<p className="z-[50] text-white text-center text-base font-medium  ">
									We hope you love your photo.
								</p>
								<Button
									onClick={() => {
										trackEvent('photo-booth-thank-you', 'click-link', [
											{
												key: 'link',
												value: 'https://www.oneractive.com',
											},
										]);
										window.location.href = 'https://www.oneractive.com';
									}}
									className="mx-auto w-full h-14 rounded-full text-xl !mt-8 bg-white text-black hover:bg-gray-100 disabled:opacity-50 px-6"
								>
									VISIT ONER ACTIVE WEBSITE
								</Button>
							</div>
						</div>
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
		</div>
	);
}
