import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Returns a singleton instance of a Socket.IO client.
 *
 * This function ensures that only one socket connection is created and reused throughout the app.
 * The socket is configured to:
 * - Use the `/api/socket` path.
 * - Use only the WebSocket transport.
 * - Not connect automatically (requires manual `.connect()`).
 *
 * @returns {Socket} A Socket.IO client instance.
 */

export function getSocket(): Socket {
	if (!socket) {
		socket = io({
			path: '/api/socket',
			autoConnect: false,
			transports: ['websocket'],
		});
	}
	return socket;
}
