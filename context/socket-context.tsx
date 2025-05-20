'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '@/lib/socket-client';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		// Wake server
		fetch('/api/socket').finally(() => {
			const sock = getSocket();
			setSocket(sock);

			const onConnect = () => setIsConnected(true);
			const onDisconnect = () => setIsConnected(false);
			const onError = (err: any) => console.error('Socket error', err);

			sock.on('connect', onConnect);
			sock.on('disconnect', onDisconnect);
			sock.on('connect_error', onError);

			sock.connect();

			return () => {
				sock.off('connect', onConnect);
				sock.off('disconnect', onDisconnect);
				sock.off('connect_error', onError);
				sock.disconnect();
			};
		});
	}, []);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
	);
}

export function useSocket() {
	const ctx = useContext(SocketContext);
	if (!ctx) throw new Error('useSocket must be inside <SocketProvider>');
	return ctx;
}
