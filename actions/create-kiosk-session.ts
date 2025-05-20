'use server';

import crypto from 'crypto';
import { getRedisClient } from '@/lib/redis';
import { SESSIONS_HASH } from '@/lib/socket-events';

const SESSION_EXPIRY = 24 * 60 * 60; // 24 hours in seconds

/**
 * Creates a new kiosk session with a unique session ID.
 * The session ID is a combination of the current timestamp and a random hex string.
 * Stores the session ID in Redis under a predefined hash with a 24-hour expiry.
 *
 * @returns {Promise<{ sessionId: string }>} An object containing the newly created session ID.
 */
export async function createKioskSession(): Promise<{ sessionId: string }> {
	const sessionId = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
	const r = getRedisClient();

	try {
		// Store session with timestamp and set expiry
		await r
			.multi()
			.hSet(SESSIONS_HASH, sessionId, Date.now().toString())
			.expire(SESSIONS_HASH, SESSION_EXPIRY)
			.exec();

		return { sessionId };
	} catch (error) {
		console.error('Failed to create session:', error);
		throw new Error('Failed to create session');
	}
}

/**
 * Checks whether a given session ID is valid (i.e., exists in Redis).
 * Also refreshes the session expiry time if valid.
 *
 * @param {string} sessionId - The session ID to validate.
 * @returns {Promise<boolean>} `true` if the session exists, `false` otherwise.
 */
export async function isSessionValid(sessionId: string): Promise<boolean> {
	if (!sessionId) {
		console.warn('No sessionId provided');
		return false;
	}

	const r = getRedisClient();

	try {
		const exists = await r.hExists(SESSIONS_HASH, sessionId);

		if (!exists) {
			console.warn(`Session ${sessionId} not found in Redis`);
			return false;
		}

		// Refresh expiry on valid session
		await r.expire(SESSIONS_HASH, SESSION_EXPIRY);
		return true;
	} catch (error) {
		console.error('Failed to validate session:', error);
		return false;
	}
}
