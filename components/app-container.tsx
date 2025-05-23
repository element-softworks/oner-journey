'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LandingScreen } from '@/components/screens/landing-screen';
import { IntroductionVideo } from '@/components/screens/introduction-video';
import { NameEntryScreen } from '@/components/screens/name-entry-screen';
import { EmailEntryScreen } from '@/components/screens/email-entry-screen';
import { ProductSelectionScreen } from '@/components/screens/product-selection-screen';
import { SummaryScreen } from '@/components/screens/summary-screen';
import { CompleteScreen } from '@/components/screens/complete-screen';
import { UserProvider } from '@/context/user-context';
import { useRegisterSW } from '@/hooks/use-register-sw';

export type AppScreen =
	| 'landing'
	| 'intro'
	| 'name'
	| 'email'
	| 'products'
	| 'summary'
	| 'complete';

export function AppContainer({ searchParams }: { searchParams?: any }) {
	const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [selectedTop, setSelectedTop] = useState(0);
	const [selectedTopColor, setSelectedTopColor] = useState('#8896B2');
	const [selectedBottom, setSelectedBottom] = useState(0);
	const [selectedBottomColor, setSelectedBottomColor] = useState('#8896B2');
	const router = useRouter();
	const pathname = usePathname();

	useRegisterSW();

	const navigateTo = (screen: AppScreen, params?: string[]) => {
		setIsTransitioning(true);
		const path =
			screen === 'landing'
				? '/'
				: `/${screen}${!!params?.length ? '?' + params.join('&') : ''}`;
		router.push(path);
		setTimeout(() => {
			setCurrentScreen(screen);
			setIsTransitioning(false);
		}, 500);
	};

	useEffect(() => {
		const path = pathname === '/' ? 'landing' : (pathname?.substring(1) as AppScreen);
		const validScreens: AppScreen[] = [
			'landing',
			'intro',
			'name',
			'email',
			'products',
			'summary',
			'complete',
		];
		const newScreen = validScreens.includes(path as AppScreen)
			? (path as AppScreen)
			: 'landing';

		setCurrentScreen(newScreen);
	}, [pathname]);

	console.log(searchParams?.bottom, 'colors data');

	return (
		<UserProvider>
			<div
				className={`w-full h-full transition-opacity duration-500 ${
					isTransitioning ? 'opacity-0' : 'opacity-100'
				}`}
			>
				{currentScreen === 'landing' && <LandingScreen onNavigate={navigateTo} />}
				{currentScreen === 'intro' && <IntroductionVideo onNavigate={navigateTo} />}
				{currentScreen === 'name' && <NameEntryScreen onNavigate={navigateTo} />}
				{currentScreen === 'email' && (
					<EmailEntryScreen onNavigate={navigateTo} searchParams={searchParams} />
				)}
				{currentScreen === 'products' && (
					<ProductSelectionScreen
						searchParams={searchParams}
						onNavigate={navigateTo}
						onSelectionChange={(top, topColor, bottom, bottomColor) => {
							setSelectedTop(top);
							setSelectedTopColor(topColor);
							setSelectedBottom(bottom);
							setSelectedBottomColor(bottomColor);
						}}
						initialTop={selectedTop}
						initialTopColor={selectedTopColor}
						initialBottom={selectedBottom}
						initialBottomColor={selectedBottomColor}
					/>
				)}
				{currentScreen === 'summary' && (
					<SummaryScreen
						searchParams={searchParams}
						onNavigate={navigateTo}
						selectedTop={Number(searchParams?.top)}
						selectedTopColor={`#${searchParams?.top_color}`}
						selectedBottom={Number(searchParams?.bottom)}
						selectedBottomColor={`#${searchParams?.bottom_color}`}
					/>
				)}
				{currentScreen === 'complete' && <CompleteScreen onNavigate={navigateTo} />}
			</div>
		</UserProvider>
	);
}
