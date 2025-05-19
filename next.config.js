/** @type {import('next').NextConfig} */
const nextConfig = {
	images: { unoptimized: true },
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	async headers() {
		const csp = [
			// allow media streams and blob: URLs
			"media-src 'self' blob: mediastream:",
			// keep the rest of your policy…
		].join('; ');

		return [
			{
				source: '/:path*',
				headers: [
					{ key: 'Content-Security-Policy', value: csp },
					{ key: 'Permissions-Policy', value: 'camera=(self)' },
				],
			},
		];
	},

	// Disable webpack cache to prevent serialization issues
	webpack: (config) => {
		config.cache = false;
		return config;
	},
	experimental: {
		serverActions: { bodySizeLimit: '20mb' },
	},
};

module.exports = nextConfig;
