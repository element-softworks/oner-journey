'use client';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ArrowLeft, Check } from 'lucide-react';
import { TOPS } from '@/lib/data/tops';
import { BOTTOMS } from '@/lib/data/bottoms';
import { useUser } from '@/context/user-context';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { motion } from 'framer-motion';

interface SummaryScreenProps {
	onNavigate: (screen: AppScreen) => void;
	selectedTop: number;
	selectedTopColor: string;
	selectedBottom: number;
	selectedBottomColor: string;
}

export function SummaryScreen({
	onNavigate,
	selectedTop,
	selectedTopColor,
	selectedBottom,
	selectedBottomColor,
}: SummaryScreenProps) {
	const { triggerHaptic } = useHapticFeedback();
	const { userData } = useUser();
	const trackEvent = useTrackEvent();

	const handleEdit = () => {
		trackEvent('build-your-fit-summary', 'edit', [{ key: 'edit', value: 'true' }]);
		triggerHaptic('light');
		onNavigate('products');
	};

	const handleFinish = () => {
		trackEvent('build-your-fit-summary', 'finish', [{ key: 'finish', value: 'true' }]);
		triggerHaptic('medium');
		onNavigate('complete');
	};

	const selectedTopItem = TOPS[selectedTop];
	const selectedBottomItem = BOTTOMS[selectedBottom];

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50">
			{/* header */}
			<header className="flex flex-col items-center pt-8 px-6">
				<h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
					FIT CHECK
				</h1>
				<p className="mt-1 text-gray-600">Here's what you’ve selected</p>
			</header>

			{/* selected items */}
			<main className="flex-1 overflow-y-auto px-6 py-10">
				<div className="flex flex-col items-center gap-14">
					{/* TOP */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="flex flex-col items-center"
					>
						<div className="w-48 h-48 rounded-3xl overflow-hidden ">
							<img
								src={
									selectedTopItem.colorImages?.[selectedTopColor] ??
									selectedTopItem.image
								}
								alt={selectedTopItem.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<h3 className="mt-4 text-lg font-semibold text-gray-900">
							{selectedTopItem.name}
						</h3>
						<p className="text-sm text-gray-600">
							{selectedTopItem.colors.find((c) => c.value === selectedTopColor)?.name}
						</p>
					</motion.div>

					{/* BOTTOM */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="flex flex-col items-center"
					>
						<div className="w-48 h-48 rounded-3xl overflow-hidden ">
							<img
								src={
									selectedBottomItem.colorImages?.[selectedBottomColor] ??
									selectedBottomItem.image
								}
								alt={selectedBottomItem.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<h3 className="mt-4 text-lg font-semibold text-gray-900">
							{selectedBottomItem.name}
						</h3>
						<p className="text-sm text-gray-600">
							{
								selectedBottomItem.colors.find(
									(c) => c.value === selectedBottomColor
								)?.name
							}
						</p>
					</motion.div>
				</div>
			</main>

			{/* action buttons */}
			<footer className="p-6 flex flex-row gap-4 mx-auto">
				<Button
					onClick={handleEdit}
					className="!mt-0 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>EDIT</span>
				</Button>
				<Button
					onClick={handleFinish}
					className="!mt-0 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>FINISH</span>
				</Button>
			</footer>
		</div>
	);
}
