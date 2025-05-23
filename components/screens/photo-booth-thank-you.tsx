'use client';

import { PhotoBoothScreen } from '@/components/photo-booth-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { toast } from '@/hooks/use-toast';
import { useMerlinSession } from '@merlincloud/mc-package';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

interface PhotoBoothThankYouProps {
	onNavigate: (screen: PhotoBoothScreen) => void;
}

export function PhotoBoothThankYou({ onNavigate }: PhotoBoothThankYouProps) {
	const { endSession: endMerlinSession } = useMerlinSession();

	const { triggerHaptic } = useHapticFeedback();

	const handleFinish = () => {
		triggerHaptic('success');
		onNavigate('landing');
	};

	useEffect(() => {
		toast({ title: 'Success!', description: 'Your photo is on its way ✉️', duration: 4000 });

		setTimeout(() => {
			endMerlinSession();
			handleFinish();
		}, 10000);
	}, []);

	return (
		<div className="flex flex-col h-full bg-white w-full">
			<div className="flex flex-col h-full bg-[#1C4639] p-6 md:py-16 w-full">
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
								<p className="z-[50] text-white text-center text-base font-medium ">
									We hope you love your photo.
								</p>
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
