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
		client = createClient({
			url: redisUrl,
			socket: {
				reconnectStrategy: (retries) => {
					// Exponential backoff with max delay of 10s
					const delay = Math.min(1000 * Math.pow(2, retries), 10000);
					return delay;
				},
				connectTimeout: 10000, // 10s timeout for initial connection
			},
		});

		client.on('error', (err) => console.error('Redis Client Error', err));
		client.on('reconnecting', () => console.log('Redis reconnecting...'));
		client.on('ready', () => console.log('Redis ready'));
		client.on('connect', () => console.log('Redis connected'));

		client
			.connect()
			.then(() => console.log('Redis connection established'))
			.catch((err) => console.error('Redis connection failed:', err));
	}
	return client;
}
