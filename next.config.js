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
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'Permissions-Policy',
						value: 'camera=(self)', // or camera=(self "https://your-cdn.com")
					},
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
