import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Slide {
	name: string;
	image: string;
	price: string;
	colors?: Array<{ name: string; value: string }>;
	colorImages?: { [key: string]: string };
}

interface EmblaCarouselProps {
	slides: Slide[];
	selectedColor: string;

	onSlideChange?: (index: number) => void;
	initialSlide?: number;
}

export function EmblaCarousel({
	slides,
	onSlideChange,
	initialSlide = 0,
	selectedColor,
}: EmblaCarouselProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: 'center',
		containScroll: 'trimSnaps',
		dragFree: true,
		startIndex: initialSlide,
	});

	const [selectedIndex, setSelectedIndex] = useState(initialSlide);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	console.log(slides, 'slides data');

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;

		const currentIndex = emblaApi.selectedScrollSnap();
		setSelectedIndex(currentIndex);
		setCanScrollPrev(emblaApi.canScrollPrev());
		setCanScrollNext(emblaApi.canScrollNext());

		if (onSlideChange) {
			onSlideChange(currentIndex);
		}
	}, [emblaApi, onSlideChange]);

	useEffect(() => {
		if (!emblaApi) return;

		onSelect();
		emblaApi.on('select', onSelect);
		emblaApi.on('reInit', onSelect);

		return () => {
			emblaApi.off('select', onSelect);
			emblaApi.off('reInit', onSelect);
		};
	}, [emblaApi, onSelect]);

	const currentColorText = slides[selectedIndex]?.colors?.find(
		(color) => color.value === selectedColor
	)?.name;

	return (
		<div className="relative">
			<div className="" ref={emblaRef}>
				<div className="flex -ml-4">
					{slides.map((slide, index) => (
						<div
							key={index}
							className="relative flex-[0_0_70%] min-w-0 pl-4"
							style={{ opacity: index === selectedIndex ? 1 : 0.4 }}
						>
							<div className="relative h-[20vw] lg:h-[50vw]  rounded-lg">
								<img
									src={slide.image}
									alt={slide.name}
									className="absolute inset-0 h-full w-full object-cover"
								/>
							</div>
							<div className="mt-4 text-center">
								<h3 className="text-sm font-medium text-gray-900">{slide.name}</h3>
								<p className="mt-1 text-sm text-gray-500">
									{slide?.colors?.find((color) => color.value === selectedColor)
										?.name ?? slide?.colors?.[0]?.name}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<Button
				variant="outline"
				size="icon"
				className={cn(
					'absolute left-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white/80 backdrop-blur-sm',
					!canScrollPrev && 'opacity-50 cursor-not-allowed'
				)}
				disabled={!canScrollPrev}
				onClick={scrollPrev}
			>
				<ChevronLeft className="h-8 w-8" />
				<span className="sr-only">Previous slide</span>
			</Button>

			<Button
				variant="outline"
				size="icon"
				className={cn(
					'absolute right-4 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white/80 backdrop-blur-sm',
					!canScrollNext && 'opacity-50 cursor-not-allowed'
				)}
				disabled={!canScrollNext}
				onClick={scrollNext}
			>
				<ChevronRight className="h-8 w-8" />
				<span className="sr-only">Next slide</span>
			</Button>
		</div>
	);
}
