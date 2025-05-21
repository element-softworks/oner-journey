'use client';

import { useState, useEffect, useRef } from 'react';
import { AppScreen } from '@/components/app-container';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { Button } from '../ui/button';
import { ArrowLeft, Router } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMerlinSession } from '@merlincloud/mc-package';

interface LandingScreenProps {
	onNavigate: (screen: AppScreen) => void;
}

export function LandingScreen({ onNavigate }: LandingScreenProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const { triggerHaptic } = useHapticFeedback();
	const router = useRouter();

	const { startSession: startMerlinSession } = useMerlinSession();

	useEffect(() => {
		setIsLoaded(true);

		if (videoRef.current) {
			const video = videoRef.current;

			// Try to play video immediately
			const playVideo = async () => {
				try {
					await video.play();
				} catch (error) {
					console.error('Initial video autoplay failed:', error);

					// Add click event listener as fallback
					const playOnInteraction = async () => {
						try {
							await video.play();
							document.removeEventListener('click', playOnInteraction);
						} catch (err) {
							console.error('Video playback failed after interaction:', err);
						}
					};

					document.addEventListener('click', playOnInteraction);
				}
			};

			playVideo();

			return () => {
				video.pause();
				video.src = '';
			};
		}
	}, []);

	const handleStart = () => {
		startMerlinSession(new Date()?.toISOString());

		triggerHaptic('medium');
		onNavigate('name');
	};

	return (
		<div className="relative w-full h-screen cursor-pointer" onClick={handleStart}>
			<div
				className={`w-full h-full flex items-center justify-center transition-opacity duration-1000 ${
					isLoaded ? 'opacity-100' : 'opacity-0'
				}`}
			>
				<video
					className="w-full h-full object-cover"
					playsInline
					muted
					loop
					autoPlay
					preload="auto"
				>
					<source src="/videos/think-live-video.mp4" type="video/mp4" />
					Your browser does not support the video tag.
				</video>

				<div className="absolute inset-0 bg-black/40 z-10" />
				<Button
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
						triggerHaptic('light');
						router.push('/');
					}}
					variant="ghost"
					size="icon"
					className="self-start text-white hover:bg-white/10 z-50 absolute top-6 left-6"
				>
					<ArrowLeft className="h-6 w-6" />
					<span className="sr-only">Back</span>
				</Button>
				<div className="flex flex-col items-center justify-center w-full h-full gap-4 mx-auto absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
					<p className="z-[50] text-white text-center text-4xl lg:text-5xl font-bold  ">
						BUILD YOUR FIT
					</p>
					<p className="z-[50] text-white text-center text-xl font-semibold  ">
						SUBMIT IT FOR A CHANGE TO WIN IT!
					</p>
					<p className="z-[50] text-white text-center text-base !mt-8 font-bold  ">
						TOUCH SCREEN TO START
					</p>
				</div>
			</div>
		</div>
	);
}
