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
import { useRouter } from 'next/navigation';

interface SummaryScreenProps {
	onNavigate: (screen: AppScreen, params?: string[]) => void;
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
	const router = useRouter();

	const handleEdit = () => {
		trackEvent('build-your-fit-summary', 'edit', [{ key: 'edit', value: 'true' }]);
		triggerHaptic('light');
		onNavigate('products', [
			`top=${searchParams?.top}`,
			`top_color=${searchParams?.top_color}`,
			`bottom=${searchParams?.bottom}`,
			`bottom_color=${searchParams?.bottom_color}`,
			`email=${searchParams?.email}`,
			`name=${searchParams?.name}`,
		]);
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
		<div className="w-full h-screen flex flex-col bg-gray-50 max-w-xl mx-auto py-8 ">
			<div className="flex flex-col items-center pt-8 px-6">
				<h1 className="text-3xl lg:text-6xl font-bold text-gray-900">BUILD YOUR FIT</h1>
			</div>

			<div className="p-6 flex flex-row gap-4 mx-auto">
				<Button
					onClick={() => {
						router.push('/outfit-selector');
					}}
					className="mx-auto  h-12 rounded-full border-gray-900 border bg-transparent text-black hover:border-gray-800 group disabled:opacity-50 w-fit px-6"
				>
					<span>CANCEL</span>
				</Button>
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
			</div>

			<div className="flex flex-col items-center gap-4">
				<div className="mt-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="flex flex-col items-center"
					>
						<div className="h-[20vw] lg:h-[50vw] w-auto rounded-3xl overflow-hidden ">
							<img
								src={
									selectedTopItem?.colorImages?.[selectedTopColor] ??
									selectedTopItem?.image
								}
								alt={selectedTopItem?.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="text-center">
							<h3 className="mt-4 text-lg font-semibold text-gray-900">
								{selectedTopItem?.name}
							</h3>
							<p className="text-sm text-gray-600">
								{
									selectedTopItem?.colors?.find?.(
										(c) => c.value === selectedTopColor
									)?.name
								}
							</p>
						</div>
					</motion.div>
				</div>

				<div className="mt-12">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="flex flex-col items-center"
					>
						<div className="h-[20vw] lg:h-[50vw] w-auto rounded-3xl overflow-hidden ">
							<img
								src={
									selectedBottomItem?.colorImages?.[selectedBottomColor] ??
									selectedBottomItem?.image
								}
								alt={selectedBottomItem?.name}
								className="w-full h-full object-cover"
							/>
						</div>
						<div className="text-center">
							<h3 className="mt-4 text-lg font-semibold text-gray-900">
								{selectedBottomItem?.name}
							</h3>
							<p className="text-sm text-gray-600">
								{
									selectedBottomItem?.colors?.find?.(
										(c) => c.value === selectedBottomColor
									)?.name
								}
							</p>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
