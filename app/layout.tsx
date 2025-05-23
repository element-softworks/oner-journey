'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { MCProvider } from '@/context/mc-provider';
import { SocketProvider } from '@/context/socket-context';
import { UserProvider } from '@/context/user-context';
import type { Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { KeyHoldNavigator } from '@/components/key-hold-navigator';

const relevantOner = localFont({
	src: '../public/RelevantOner-Bold.otf',
	weight: '700',
	style: 'normal',
	variable: '--font-relevant-oner',
});

// export const metadata: Metadata = {
// 	title: 'ONER Retail',
// 	description: 'Premium retail experience in New York',
// };

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"
				/>
				<meta name="theme-color" content="#ffffff" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="stylesheet" href="/fonts.css" />
				<title>ONER Retail</title>

				<meta name="description" content="Premium retail experience in New York" />
			</head>
			<body className={relevantOner.className}>
				<MCProvider>
					<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
						<SocketProvider>
							<UserProvider>
								<KeyHoldNavigator />
								{children}
								<Toaster />
							</UserProvider>
						</SocketProvider>
					</ThemeProvider>
				</MCProvider>
			</body>
		</html>
	);
}
