'use client';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useUser } from '@/context/user-context';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useMerlinSession } from '@merlincloud/mc-package';
import { useRouter } from 'next/navigation';

interface CompleteScreenProps {
	onNavigate: (screen: AppScreen) => void;
}

export function CompleteScreen({ onNavigate }: CompleteScreenProps) {
	const { userData } = useUser();
	const { triggerHaptic } = useHapticFeedback();
	const router = useRouter();
	const { endSession: endMerlinSession } = useMerlinSession();

	const handleStartOver = () => {
		triggerHaptic('medium');
		onNavigate('landing');
	};

	useEffect(() => {
		setTimeout(() => {
			endMerlinSession();

			router.push('/outfit-selector');
		}, 10000);
	}, []);

	return (
		<div className="flex flex-col h-full bg-[#5B7FCA]">
			<div className="flex flex-col h-full bg-[#5B7FCA] max-w-2xl p-6 py-16 mx-auto">
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
								<p className="z-[50] text-white text-center text-6xl lg:text-5xl font-bold  ">
									THANK YOU
								</p>
								<p className="z-[50] text-white text-center text-3xl font-medium uppercase ">
									you have been entered into our competition.
								</p>
								<p className="z-[50] text-white text-center text-base font-regular  !my-8">
									You'll get an email from us if you're one of the lucky winners!
								</p>

								<p className="z-[50] text-white text-center text-3xl font-medium uppercase ">
									Scan below to discover more
								</p>
								<div className="flex flex-col items-center mt-4">
									<img
										src="https://api.merlincloud.ai/pg/BFQP/qr"
										alt="Scan QR code"
										className="sm:w-[40vw] w-[60vw] max-w-[200px] mb-2 rounded-lg border bg-white"
									/>
								</div>
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
