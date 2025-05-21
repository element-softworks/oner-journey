'use client';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ArrowLeft, Check } from 'lucide-react';
import { TOPS } from '@/lib/data/tops';
import { BOTTOMS } from '@/lib/data/bottoms';
import { useUser } from '@/context/user-context';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

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
		trackEvent('build-your-fit-summary', 'edit', [
			{
				key: 'edit',
				value: 'true',
			},
		]);
		triggerHaptic('light');
		onNavigate('products');
	};

	const handleFinish = () => {
		trackEvent('build-your-fit-summary', 'finish', [
			{
				key: 'finish',
				value: 'true',
			},
		]);
		triggerHaptic('medium');
		onNavigate('complete');
	};

	const selectedTopItem = TOPS[selectedTop];
	const selectedBottomItem = BOTTOMS[selectedBottom];

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50">
			<div className="flex flex-col items-center pt-8 px-6">
				<img
					src="https://www.purpldiscounts.com/_next/image?url=https%3A%2F%2Fverification.purpldiscounts.com%2Fassets%2Fbrand_logo%2FoVEXAJ6RTzflVHvf3ePEs0e&w=828&q=75"
					alt="ONER"
					className="h-12 w-auto mb-4"
				/>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">FIT CHECK</h1>
				<p className="text-gray-600">Here's what you've selected</p>
			</div>

			<div className="flex-1 px-6 py-8">
				<div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
					{/* Selected Items */}
					<div className="space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
								<img
									src={
										selectedTopItem.colorImages?.[selectedTopColor] ||
										selectedTopItem.image
									}
									alt={selectedTopItem.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">
									{selectedTopItem.name}
								</h3>
								<p className="text-sm text-gray-600">
									{
										selectedTopItem.colors.find(
											(c) => c.value === selectedTopColor
										)?.name
									}
								</p>
								<p className="text-sm font-medium text-gray-900">
									{selectedTopItem.price}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4">
							<div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
								<img
									src={selectedBottomItem.image}
									alt={selectedBottomItem.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">
									{selectedBottomItem.name}
								</h3>
								<p className="text-sm text-gray-600">True Blue</p>
								<p className="text-sm font-medium text-gray-900">
									{selectedBottomItem.price}
								</p>
							</div>
						</div>
					</div>

					{/* Competition Entry Message */}
					<div className="text-center py-4 border-t border-b border-gray-200">
						<p className="text-sm text-gray-600">
							You have been entered into a competition to win your look
						</p>
					</div>
				</div>
			</div>

			<div className="p-6 flex flex-row gap-4 mx-auto">
				<Button
					onClick={handleEdit}
					className=" !mt-8 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>EDIT</span>
				</Button>
				<Button
					onClick={handleFinish}
					className=" !mt-8 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>FINISH</span>
				</Button>
			</div>
		</div>
	);
}
