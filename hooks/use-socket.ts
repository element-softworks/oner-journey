'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/socket-context';
import { CORE_EVENTS } from '@/lib/socket-events';
import { DEVICE_TYPE } from '@/lib/socket-events';

type EventHandler = (...args: any[]) => void;

interface UseSocketRoomOptions {
	sessionId?: string;
	role?: DEVICE_TYPE;
	handlers?: Record<string, EventHandler>;
}

export function useSocketRoom({ sessionId, role, handlers }: UseSocketRoomOptions) {
	const { socket, isConnected } = useSocket();

	useEffect(() => {
		if (!sessionId) return;
		if (!socket) return;

		// 1) Wake server & connect if needed
		if (!isConnected) {
			fetch('/api/socket').finally(() => {
				socket.connect();
			});
		}

		// 2) Emit JOIN_ROOM once connected (or immediately)
		const doJoin = () => {
			console.log(`Joining room "${sessionId}" as ${role}`);
			socket.emit(CORE_EVENTS.JOIN_ROOM, { sessionId, role });
		};
		if (socket.connected) {
			doJoin();
		} else {
			socket.once('connect', doJoin);
		}

		// 3) Attach user‐provided handlers
		if (handlers) {
			for (const [evt, fn] of Object.entries(handlers)) {
				socket.on(evt, fn);
			}
		}

		// 4) Cleanup: remove our listeners (but DO NOT disconnect)
		return () => {
			socket.off('connect', doJoin);
			if (handlers) {
				for (const [evt, fn] of Object.entries(handlers)) {
					socket.off(evt, fn as EventHandler);
				}
			}
		};
	}, [socket, isConnected, sessionId, role, handlers && Object.keys(handlers).sort().join(',')]);

	// **Now** we return the socket so callers can destructure it
	return { socket, isConnected };
}
