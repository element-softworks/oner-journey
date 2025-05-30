// pages/api/socket.ts

import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from '@/lib/types';
import { Server as IOServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { getRedisClient } from '@/lib/redis';

import {
	CORE_EVENTS,
	MOBILE_EVENTS,
	KIOSK_EVENTS,
	DEVICE_TYPE,
	SESSIONS_HASH,
	CLIENT_ROOMS_HASH,
} from '@/lib/socket-events';
import { isSessionValid } from '@/actions/create-kiosk-session';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
	console.log('Socket API handler invoked');

	if (!res.socket.server.io) {
		console.log('Setting up Socket.IO server');
		const io = new IOServer(res.socket.server as any, {
			path: '/api/socket',
			cors: {
				origin:
					process.env.NODE_ENV === 'production'
						? [
								process.env.NEXT_PUBLIC_BASE_URL as string,
								'https://oner-journey-production.up.railway.app/',
								'https://oner.and-element.io/',
								'https://reliable-bonbon-7afda0.netlify.app/',
							]
						: '*',
				credentials: false,
			},
			// Add ping timeout and interval configuration
			pingTimeout: 60000,
			pingInterval: 25000,
		});
		res.socket.server.io = io;

		const pubClient = getRedisClient();
		const subClient = pubClient.duplicate();
		await subClient.connect();
		io.adapter(createAdapter(pubClient, subClient));

		io.on('connection', (socket) => {
			console.log(`Connection established: socketId=${socket.id}`);

			// ─── JOIN_ROOM ───────────────────────────────────────────────────────
			socket.on(
				CORE_EVENTS.JOIN_ROOM,
				async ({ sessionId, role }: { sessionId: string; role: DEVICE_TYPE }) => {
					console.log(
						`Event: ${CORE_EVENTS.JOIN_ROOM} — socketId=${socket.id}, sessionId=${sessionId}, role=${role}`
					);

					try {
						const valid = await isSessionValid(sessionId);
						if (!valid) {
							console.warn(`Invalid sessionId=${sessionId}`);
							socket.emit(CORE_EVENTS.ERROR, 'Invalid session');
							return;
						}

						await pubClient.hSet(CLIENT_ROOMS_HASH, socket.id, sessionId);
						socket.join(sessionId);
						socket.data.sessionId = sessionId;
						socket.data.role = role;

						console.log(`Socket ${socket.id} joined room ${sessionId}`);
						socket.emit(CORE_EVENTS.JOINED_ROOM, { sessionId, role });

						if (role === DEVICE_TYPE.MOBILE) {
							io.to(sessionId).emit(KIOSK_EVENTS.MOBILE_JOINED, { sessionId });
						}

						// ─── MOBILE HANDLERS ────────────────────────────────────────────
						if (role === DEVICE_TYPE.MOBILE) {
							// user entered name/email
							socket.on(
								MOBILE_EVENTS.DETAILS,
								({ name, email }: { name: string; email: string }) => {
									console.log(
										`Event: ${MOBILE_EVENTS.DETAILS} — sessionId=${sessionId}, name=${name}, email=${email}`
									);
									io.to(sessionId).emit(MOBILE_EVENTS.DETAILS, { name, email });
								}
							);

							socket.on(
								MOBILE_EVENTS.TAKE_PHOTO,
								({ cancel }: { cancel?: boolean } = {}) => {
									if (cancel) {
										console.log(
											`Event: MOBILE_EVENTS.TAKE_PHOTO (cancel) — sessionId=${sessionId}`
										);
										io.to(sessionId).emit(KIOSK_EVENTS.CANCEL_PHOTO);
									} else {
										console.log(
											`Event: ${MOBILE_EVENTS.TAKE_PHOTO} — sessionId=${sessionId} - cancel = ${cancel}`
										);
										io.to(sessionId).emit(KIOSK_EVENTS.TRIGGER_CAMERA);
									}
								}
							);

							// user accepted or declined the photo preview
							socket.on(
								MOBILE_EVENTS.PHOTO_DECISION,
								({
									decision,
									retake = false,
								}: {
									decision: boolean;
									retake?: boolean;
								}) => {
									console.log(
										`Event: ${MOBILE_EVENTS.PHOTO_DECISION} — sessionId=${sessionId}, decision=${decision}`
									);

									// If retake requested, send RETAKE_PHOTO and skip everything else
									if (retake) {
										console.log(
											`Mobile requested a retake for session ${sessionId}`
										);
										io.to(sessionId).emit(KIOSK_EVENTS.RETAKE_PHOTO);
										return;
									}

									if (decision) {
										io.to(sessionId).emit(KIOSK_EVENTS.PHOTO_DECISION, {
											decision: true,
										});
									} else {
										io.to(sessionId).emit(KIOSK_EVENTS.CANCEL_PHOTO);
									}

									// tell mobile to show thank-you screen
									// socket.emit(MOBILE_EVENTS.THANK_YOU);
								}
							);

							//Mobile timeout "warning"
							socket.on(MOBILE_EVENTS.TIMEOUT_WARNING, () => {
								console.log(
									`[Timeout Warning] mobile ${socket.id} in session ${sessionId}`
								);
								io.to(sessionId).emit(KIOSK_EVENTS.TIMEOUT_WARNING, { sessionId });
							});

							//Mobile confirms "I'm still here"
							socket.on(MOBILE_EVENTS.TIMEOUT_CONFIRM, () => {
								console.log(
									`[Timeout Confirm] mobile ${socket.id} in session ${sessionId}`
								);
								io.to(sessionId).emit(KIOSK_EVENTS.TIMEOUT_CONFIRM, { sessionId });
							});

							//Mobile cancels (or auto‐cancels) the session
							socket.on(MOBILE_EVENTS.TIMEOUT_CANCEL, () => {
								console.log(
									`[Timeout Cancel] mobile ${socket.id} in session ${sessionId}`
								);
								io.to(sessionId).emit(KIOSK_EVENTS.TIMEOUT_CANCEL, { sessionId });
							});
						}

						// ─── KIOSK HANDLERS ─────────────────────────────────────────────
						if (role === DEVICE_TYPE.KIOSK) {
							// kiosk sends back the captured photo URL
							socket.on(
								KIOSK_EVENTS.PHOTO_TAKEN,
								({ photoUrl }: { photoUrl: string }) => {
									console.log(
										`Event: ${KIOSK_EVENTS.PHOTO_TAKEN} — sessionId=${sessionId}, photoUrl=${photoUrl}`
									);

									// send preview to mobile
									io.to(sessionId).emit(KIOSK_EVENTS.PHOTO_PREVIEW, { photoUrl });

									// then show kiosk's thank-you screen
									socket.emit(KIOSK_EVENTS.THANK_YOU);
								}
							);
						}
					} catch (error) {
						console.error('Error in JOIN_ROOM handler:', error);
						socket.emit(CORE_EVENTS.ERROR, 'Server error');
					}
				}
			);

			// ─── CLEANUP ────────────────────────────────────────────────────────
			socket.on('disconnect', async (reason) => {
				console.log(`Disconnect: socketId=${socket.id}, reason=${reason}`);

				try {
					const sessionId = await pubClient.hGet(CLIENT_ROOMS_HASH, socket.id);
					if (!sessionId) return;

					await pubClient.hDel(CLIENT_ROOMS_HASH, socket.id);
					console.log(`Removed socketId=${socket.id} from session=${sessionId}`);

					const allSessions = await pubClient.hVals(CLIENT_ROOMS_HASH);
					const stillInRoom = allSessions.includes(sessionId);

					if (!stillInRoom) {
						await pubClient.hDel(SESSIONS_HASH, sessionId);
						console.log(`Removed sessionId=${sessionId} from ${SESSIONS_HASH}`);
					}
				} catch (error) {
					console.error('Error in disconnect handler:', error);
				}
			});
		});
	} else {
		console.log('Socket.IO server already initialized');
	}

	res.end();
}
