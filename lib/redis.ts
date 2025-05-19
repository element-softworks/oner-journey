import { createClient, RedisClientType } from 'redis';

/**
 * Initializes and returns a singleton Redis client instance.
 *
 * This function ensures that only one Redis client is created and reused across the application.
 * It connects to Redis using the `REDIS_URL` environment variable. If the connection fails,
 * it logs the error to the console.
 *
 * @throws Will throw an error if the `REDIS_URL` environment variable is missing or invalid.
 * @returns {RedisClientType} A connected Redis client instance.
 */

const redisUrl = process.env.REDIS_URL;
if (!redisUrl || typeof redisUrl !== 'string') {
	throw new Error('Invalid or missing REDIS_URL environment variable');
}

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
	if (!client) {
		client = createClient({ url: redisUrl });
		client.on('error', (err) => console.error('Redis Client Error', err));
		client
			.connect()
			.then(() => console.log('Redis connected'))
			.catch((err) => console.error('Redis connection failed:', err));
	}
	return client;
}
