'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket-client';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const socket = getSocket();

		function onConnect() {
			console.log(`Socket connected [id=${socket.id}]`);
			setIsConnected(true);
		}

		function onDisconnect() {
			console.log('Socket disconnected');
			setIsConnected(false);
		}

		function onError(err: Error) {
			console.error('Socket error:', err);
			// Attempt to reconnect on error
			socket.connect();
		}

		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('error', onError);

		setSocket(socket);
		socket.connect();

		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('error', onError);
			socket.disconnect();
		};
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
}
