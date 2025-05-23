import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { ArrowLeft, Check } from 'lucide-react';
import { TOPS } from '@/lib/data/tops';
import { BOTTOMS } from '@/lib/data/bottoms';
import { useUser } from '@/context/user-context';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface SummaryScreenProps {
	onNavigate: (screen: AppScreen) => void;
	selectedTop: number;
	selectedTopColor: string;
	selectedBottom: number;
	selectedBottomColor: string;
	searchParams?: any;
}

export function SummaryScreen({
	onNavigate,
	selectedTop,
	selectedTopColor,
	selectedBottom,
	selectedBottomColor,
	searchParams,
}: SummaryScreenProps) {
	const { triggerHaptic } = useHapticFeedback();
	const { userData } = useUser();
	const trackEvent = useTrackEvent();
	const [finishing, setFinishing] = useState(false);

	const handleEdit = () => {
		trackEvent('build-your-fit-summary', 'edit', [{ key: 'edit', value: 'true' }]);
		triggerHaptic('light');
		onNavigate('products');
	};

	const handleFinish = async () => {
		setFinishing(true);
		trackEvent('build-your-fit-summary', 'finish', [{ key: 'finish', value: 'true' }]);
		triggerHaptic('medium');

		// Save to Supabase

		const res = await fetch('/api/outfit-selector', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: searchParams.email,
				name: searchParams.name,
			}),
		});

		const { error: dbError } = await supabase.from('oner_data').insert({
			email: searchParams.email,
			raw: {
				type: 'outfit_selector',
				name: searchParams?.name,
				selected_top: {
					id: selectedTop,
					name: TOPS[selectedTop].name,
					color: selectedTopColor,
				},
				selected_bottom: {
					id: selectedBottom,
					name: BOTTOMS[selectedBottom].name,
					color: selectedBottomColor,
				},
				timestamp: new Date().toISOString(),
			},
		});

		if (dbError) {
			console.error('Failed to save to Supabase:', dbError);
		}

		onNavigate('complete');
	};

	const selectedTopItem = TOPS[selectedTop];
	const selectedBottomItem = BOTTOMS[selectedBottom];

	return (
		<div className="w-full h-screen flex flex-col bg-gray-50 justify-between overflow-auto">
			{/* header */}
			<header className="flex flex-col items-center pt-8 px-6 ">
				<h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900">
					FIT CHECK
				</h1>
				<p className="mt-1 text-gray-600">Here's what you've selected</p>
			</header>

			{/* selected items */}
			<div className="flex flex-col items-center ">
				{/* TOP */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="flex flex-col items-center"
				>
					<div className="w-[20vw] h-[20vw] rounded-3xl overflow-hidden ">
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
					<div className="w-[20vw] h-[20vw] rounded-3xl overflow-hidden ">
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
							selectedBottomItem.colors.find((c) => c.value === selectedBottomColor)
								?.name
						}
					</p>
				</motion.div>
			</div>

			{/* action buttons */}
			<footer className="p-6 flex flex-row gap-4 mx-auto">
				<Button
					disabled={finishing}
					onClick={handleEdit}
					className="!mt-0 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>EDIT</span>
				</Button>
				<Button
					disabled={finishing}
					onClick={handleFinish}
					className="!mt-0 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>{finishing ? 'LOADING...' : 'FINISH'}</span>
				</Button>
			</footer>
		</div>
	);
}
