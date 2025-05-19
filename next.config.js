/** @type {import('next').NextConfig} */
const nextConfig = {
	images: { unoptimized: true },
	eslint: {
		ignoreDuringBuilds: true,
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
