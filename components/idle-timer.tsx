'use client';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { usePathname, useRouter } from 'next/navigation';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSocketRoom } from '@/hooks/use-socket';
import { CORE_EVENTS, DEVICE_TYPE, MOBILE_EVENTS, KIOSK_EVENTS } from '@/lib/socket-events';
import { useMerlinSession } from '@merlincloud/mc-package';
import { useTrackEvent } from '@/lib/MerlinAnalytics';

interface IdleTimerProps {
	sessionId?: string;
	role?: DEVICE_TYPE;
	noSocket?: boolean;
}

export function IdleTimer({ sessionId, role }: IdleTimerProps) {
	const { endSession: endMerlinSession } = useMerlinSession();
	const trackEvent = useTrackEvent();

	const pathName = usePathname();
	const [showWarning, setShowWarning] = useState(false);
	const [countdown, setCountdown] = useState(30);
	const router = useRouter();
	const [ready, setReady] = useState(false);

	const isPhotoBooth = pathName?.includes('/photo-booth');

	const { socket } = useSocketRoom({
		sessionId,
		role,
		handlers: {
			[CORE_EVENTS.JOINED_ROOM]: () => {
				setReady(true);
			},
			[CORE_EVENTS.ERROR]: (err: string) => console.error('Socket error:', err),
			[KIOSK_EVENTS.TIMEOUT_WARNING]: () => {
				trackEvent('photo-booth-idle-timer', 'timeout-warning', [
					{
						key: 'warning',
						value: 'true',
					},
				]);
				setShowWarning(true);
			},
			[KIOSK_EVENTS.TIMEOUT_CONFIRM]: () => {
				trackEvent('photo-booth-idle-timer', 'timeout-dismiss', [
					{
						key: 'dismissed',
						value: 'true',
					},
				]);
				setShowWarning(false);
				setCountdown(30);
			},
			[KIOSK_EVENTS.TIMEOUT_CANCEL]: () => {
				trackEvent('photo-booth-idle-timer', 'timeout-cancelled', [
					{
						key: 'cancelled',
						value: 'true',
					},
				]);
				endMerlinSession();

				const isMobile = pathName?.includes('/mobile');

				!isPhotoBooth
					? router.push('/outfit-selector')
					: isMobile
					? router.push(
							'https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY'
					  )
					: router.push('/photo-booth');
			},
		},
	});

	const onIdle = () => {
		if (pathName?.includes('/mobile/thank-you')) {
			return;
		}

		if (!isPhotoBooth) {
			router.push('/outfit-selector');
		}

		setShowWarning(true);

		if (!socket) return;

		if (role === DEVICE_TYPE.MOBILE) {
			socket.emit(MOBILE_EVENTS.TIMEOUT_WARNING);
		}
	};

	const { reset, getRemainingTime } = useIdleTimer({
		// timeout: 60 * 1000, // 1 minute
		timeout: 1000 * (isPhotoBooth ? 300 : 120),

		onIdle,
		onActive(event, idleTimer) {
			console.log('User is active', event, idleTimer);
		},
		onAction: () => {
			console.log('User did something');
		},
		events: [
			'mousemove',
			'keydown',
			'wheel',
			'DOMMouseScroll',
			'mousewheel',
			'mousedown',
			'touchstart',
			'touchmove',
			'MSPointerDown',
			'MSPointerMove',
			'focus',
		],

		debounce: 500,
	});

	console.log(getRemainingTime(), 'getRemainingTime');

	useEffect(() => {
		if (pathName?.includes('/mobile/thank-you')) {
			return;
		}

		let timer: NodeJS.Timeout;

		if (showWarning) {
			timer = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						if (socket && role === DEVICE_TYPE.MOBILE) {
							socket.emit(MOBILE_EVENTS.TIMEOUT_CANCEL);
						}
						trackEvent('photo-booth-idle-timer', 'timeout-expired', [
							{
								key: 'expired',
								value: 'true',
							},
						]);
						endMerlinSession();

						const isMobile = pathName?.includes('/mobile');

						isMobile
							? router.push(
									'https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY'
							  )
							: router.push('/photo-booth');
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [showWarning, socket, role, router]);

	const handleContinue = () => {
		if (!socket) return;

		if (role === DEVICE_TYPE.MOBILE) {
			socket.emit(MOBILE_EVENTS.TIMEOUT_CONFIRM);
		}

		setShowWarning(false);
		setCountdown(30);
		reset();
	};

	const handleEnd = () => {
		if (!socket) return;

		if (role === DEVICE_TYPE.MOBILE) {
			socket.emit(MOBILE_EVENTS.TIMEOUT_CANCEL);
		}

		trackEvent('photo-booth-idle-timer', 'timeout-cancelled', [
			{
				key: 'cancelled',
				value: 'true',
			},
		]);
		endMerlinSession();

		const isMobile = pathName?.includes('/mobile');

		isMobile
			? router.push(
					'https://us.oneractive.com/collections/shop/new?utm_source=email&utm_medium=newsletter&utm_campaign=Pop-Up-NY'
			  )
			: router.push('/photo-booth');
	};

	return (
		<AlertDialog open={showWarning}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you still there?</AlertDialogTitle>
					<AlertDialogDescription>
						{role === DEVICE_TYPE.KIOSK ? (
							<>Session will timeout in {countdown} seconds</>
						) : (
							<>Your session will end soon due to inactivity.</>
						)}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{role === DEVICE_TYPE.MOBILE && (
						<>
							<AlertDialogCancel onClick={handleEnd}>End Journey</AlertDialogCancel>
							<AlertDialogAction onClick={handleContinue}>
								Continue Journey
							</AlertDialogAction>
						</>
					)}
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
