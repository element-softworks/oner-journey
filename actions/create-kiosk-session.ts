'use server';

import crypto from 'crypto';
import { getRedisClient } from '@/lib/redis';
import { SESSIONS_HASH } from '@/lib/socket-events';

/**
 * Creates a new kiosk session with a unique session ID.
 * The session ID is a combination of the current timestamp and a random hex string.
 * Stores the session ID in Redis under a predefined hash.
 *
 * @returns {Promise<{ sessionId: string }>} An object containing the newly created session ID.
 */
export async function createKioskSession(): Promise<{ sessionId: string }> {
	const sessionId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
	const r = getRedisClient();
	await r.hSet(SESSIONS_HASH, sessionId, Date.now().toString());
	return { sessionId };
}

/**
 * Checks whether a given session ID is valid (i.e., exists in Redis).
 *
 * @param {string} sessionId - The session ID to validate.
 * @returns {Promise<boolean>} `true` if the session exists, `false` otherwise.
 */
export async function isSessionValid(sessionId: string): Promise<boolean> {
	const r = getRedisClient();
	const exists = await r.hExists(SESSIONS_HASH, sessionId);
	return exists === 1;
}
