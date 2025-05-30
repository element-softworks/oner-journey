'use client';

import { AppScreen } from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { EmblaCarousel } from '@/components/ui/embla-carousel';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { BOTTOMS } from '@/lib/data/bottoms';
import { TOPS } from '@/lib/data/tops';
import { useTrackEvent } from '@/lib/MerlinAnalytics';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductSelectionScreenProps {
	onNavigate: (screen: AppScreen, params?: string[]) => void;
	onSelectionChange: (top: number, topColor: string, bottom: number, bottomColor: string) => void;
	initialTop: number;
	initialTopColor: string;
	initialBottom: number;
	initialBottomColor: string;
	searchParams?: any;
}

export function ProductSelectionScreen({
	onNavigate,
	onSelectionChange,
	initialTop,
	initialTopColor,
	initialBottom,
	searchParams,
	initialBottomColor,
}: ProductSelectionScreenProps) {
	const [selectedTopIndex, setSelectedTopIndex] = useState(initialTop);
	const [topColor, setTopColor] = useState(initialTopColor);
	const [selectedBottomIndex, setSelectedBottomIndex] = useState(initialBottom);
	const [bottomColor, setBottomColor] = useState(initialBottomColor);
	const { triggerHaptic } = useHapticFeedback();
	const trackEvent = useTrackEvent();
	const router = useRouter();

	const handleContinue = () => {
		trackEvent('build-your-fit-product-selection', 'confirm', [
			{
				key: 'top',
				value: TOPS[selectedTopIndex]?.image ?? '',
			},
			{
				key: 'top_color',
				value: topColor,
			},
			{
				key: 'bottom',
				value: BOTTOMS[selectedBottomIndex]?.image ?? '',
			},
			{
				key: 'bottom_color',
				value: bottomColor,
			},
		]);

		triggerHaptic('medium');
		onNavigate('summary', [
			`top=${selectedTopIndex}`,
			`top_color=${topColor?.split('#')?.[1]}`,
			`bottom=${selectedBottomIndex}`,
			`bottom_color=${bottomColor?.split('#')?.[1]}`,
			`email=${searchParams?.email}`,
			`name=${searchParams?.name}`,
		]);
	};

	const getCurrentTopImage = () => {
		if (selectedTopIndex === null || !TOPS[selectedTopIndex]) return null;

		const currentTop = TOPS[selectedTopIndex];
		if (currentTop.colorImages && topColor && currentTop.colorImages[topColor]) {
			return currentTop.colorImages[topColor];
		}
		return currentTop.image;
	};
	const getCurrentBottomImage = () => {
		if (selectedBottomIndex === null || !BOTTOMS[selectedBottomIndex]) return null;

		const currentBottom = BOTTOMS[selectedBottomIndex];
		if (currentBottom.colorImages && bottomColor && currentBottom.colorImages[bottomColor]) {
			return currentBottom.colorImages[bottomColor];
		}
		return currentBottom.image;
	};

	const handleTopChange = (index: number) => {
		if (!TOPS[index]) return;

		const newTop = TOPS[index];
		setSelectedTopIndex(index);

		const colorExists = newTop.colors.some((color) => color.value === topColor);
		if (!colorExists) {
			setTopColor(newTop.colors[0]?.value || '');
		}

		triggerHaptic('light');
	};

	const handleBottomChange = (index: number) => {
		if (!BOTTOMS[index]) return;

		setSelectedBottomIndex(index);

		const colourExists = BOTTOMS[index].colors.some((c) => c.value === bottomColor);
		if (!colourExists) {
			setBottomColor(BOTTOMS[index].colors[0]?.value || '');
		}

		triggerHaptic('light');
	};

	if (TOPS.length === 0) {
		return (
			<div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
				<p className="text-gray-900">No products available</p>
			</div>
		);
	}

	return (
		<div className="w-full h-full overflow-x-hidden py-8">
			<div className="w-full h-screen flex flex-col bg-gray-50 max-w-xl mx-auto justify-start ">
				<div className="flex flex-col items-center pt-8 px-6">
					<h1 className="text-3xl lg:text-6xl font-bold text-gray-900">BUILD YOUR FIT</h1>
				</div>

				<div className="p-6 mx-auto flex flex-row gap-4 items-center">
					<Button
						onClick={() => {
							router.push('/outfit-selector');
						}}
						className="mx-auto  h-12 rounded-full border-gray-900 border bg-transparent text-black hover:border-gray-800 group disabled:opacity-50 w-fit px-6"
					>
						<span>CANCEL</span>
					</Button>
					<Button
						onClick={handleContinue}
						className="mx-auto  h-12 rounded-full bg-gray-900 text-white hover:bg-gray-800 group disabled:opacity-50 w-fit px-6"
					>
						<span>CONFIRM</span>
					</Button>
				</div>

				<div className="flex flex-col items-center gap-4">
					<div className="mt-4">
						{selectedTopIndex !== null && TOPS[selectedTopIndex] && (
							<div className="flex justify-center gap-3 mt-4 mb-4">
								{TOPS[selectedTopIndex].colors.map((color) => (
									<motion.button
										key={color.value}
										onClick={() => {
											setTopColor(color.value);
											triggerHaptic('light');
										}}
										className={`w-8 h-8 rounded-full transition-transform ${
											topColor === color.value
												? 'scale-110 ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50'
												: ''
										}`}
										style={{ backgroundColor: color.value }}
										whileTap={{ scale: 0.95 }}
										aria-label={`Select ${color.name}`}
									/>
								))}
							</div>
						)}
						<EmblaCarousel
							selectedColor={topColor}
							slides={TOPS.map((top, index) => ({
								...top,
								image:
									index === selectedTopIndex
										? getCurrentTopImage() || top.image
										: top.colorImages?.[topColor] || top.image,
							}))}
							onSlideChange={handleTopChange}
							initialSlide={initialTop}
						/>
					</div>

					<div className="mt-12 lg:-mt-10">
						{selectedBottomIndex !== null && BOTTOMS[selectedBottomIndex] && (
							<div className="flex justify-center gap-3 mt-4 mb-4">
								{BOTTOMS[selectedBottomIndex].colors.map((color) => (
									<motion.button
										key={color.value}
										onClick={() => {
											setBottomColor(color.value);
											triggerHaptic('light');
										}}
										className={`w-8 h-8 rounded-full transition-transform ${
											bottomColor === color.value
												? 'scale-110 ring-2 ring-gray-900 ring-offset-2 ring-offset-gray-50'
												: ''
										}`}
										style={{ backgroundColor: color.value }}
										whileTap={{ scale: 0.95 }}
										aria-label={`Select ${color.name}`}
									/>
								))}
							</div>
						)}
						<EmblaCarousel
							selectedColor={bottomColor}
							slides={BOTTOMS.map((bottom, index) => ({
								...bottom,
								image:
									index === selectedBottomIndex
										? getCurrentBottomImage() || bottom.image
										: bottom.colorImages?.[bottomColor] || bottom.image,
							}))}
							onSlideChange={handleBottomChange}
							initialSlide={initialBottom}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
