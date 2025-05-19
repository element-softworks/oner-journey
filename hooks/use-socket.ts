'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket-client';
import { CORE_EVENTS } from '@/lib/socket-events';
import { DEVICE_TYPE } from '@/lib/socket-events';
import type { Socket } from 'socket.io-client';

// Union of all possible socket event names
export type SocketEventName =
	| (typeof CORE_EVENTS)[keyof typeof CORE_EVENTS]
	| (typeof import('@/lib/socket-events').MOBILE_EVENTS)[keyof typeof import('@/lib/socket-events').MOBILE_EVENTS]
	| (typeof import('@/lib/socket-events').KIOSK_EVENTS)[keyof typeof import('@/lib/socket-events').KIOSK_EVENTS];

interface UseSocketRoomOptions {
	sessionId: string;
	role: DEVICE_TYPE;
	handlers?: Partial<Record<SocketEventName, (...args: any[]) => void>>;
}

export function useSocketRoom({ sessionId, role, handlers }: UseSocketRoomOptions) {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		let isMounted = true;

		// "Wake" the socket server first
		fetch('/api/socket').finally(() => {
			if (!isMounted) return;

			const socket = getSocket();
			socketRef.current = socket;

			// 1) Core listeners: connect / error / disconnect
			socket.on('connect', () => {
				console.log(`Socket connected [id=${socket.id}]`);
				socket.emit(CORE_EVENTS.JOIN_ROOM, { sessionId, role });
			});
			socket.on('connect_error', (err) => {
				console.error('Socket connect error:', err);
			});
			socket.on('disconnect', (reason) => {
				console.log(`Socket disconnected [id=${socket.id}] reason=${reason}`);
			});

			// 2) User‐provided handlers for any CORE, MOBILE or KIOSK events
			if (handlers) {
				Object.entries(handlers).forEach(([eventName, handler]) => {
					socket.on(eventName, handler as (...args: any[]) => void);
				});
			}

			// 3) Kick off the connection
			socket.connect();
		});

		return () => {
			isMounted = false;
			const socket = socketRef.current;
			if (socket) {
				// teardown core listeners
				socket.off('connect');
				socket.off('connect_error');
				socket.off('disconnect');

				// teardown user handlers
				if (handlers) {
					Object.entries(handlers).forEach(([eventName, handler]) => {
						socket.off(eventName, handler as (...args: any[]) => void);
					});
				}
				socket.disconnect();
			}
		};
		// Re-run effect only if sessionId or role change, or the *set* of handler keys changes
	}, [sessionId, role, handlers && Object.keys(handlers).sort().join(',')]);

	return { socket: socketRef.current };
}
