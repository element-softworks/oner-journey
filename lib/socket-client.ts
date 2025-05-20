import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
	if (!socket) {
		socket = io({
			path: '/api/socket',
			autoConnect: false,
			transports: ['websocket'],
			reconnectionAttempts: 5,
			reconnectionDelay: 1000,
			timeout: 20000,
		});
	}
	return socket;
}
