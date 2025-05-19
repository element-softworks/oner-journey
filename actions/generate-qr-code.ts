'use server';

import QRCode from 'qrcode';

/**
 * Generates a QR code as a data URL encoding a URL with session details.
 *
 * The generated URL includes the session ID and optional name and email as query parameters,
 * and it points to the mobile details page of the photo booth.
 *
 * @param {string} sessionId - The session ID to include in the QR code.
 * @param {string} [name] - Optional name to include in the URL.
 * @param {string} [email] - Optional email to include in the URL.
 * @returns {Promise<string>} A promise that resolves to a base64-encoded PNG data URL representing the QR code.
 */
export async function generateQRCodeDataUrl(
	sessionId: string,
	name?: string,
	email?: string
): Promise<string> {
	const params = new URLSearchParams({ sessionId });
	if (name) params.append('name', name);
	if (email) params.append('email', email);

	// Construct your redirect URL
	const url = `${
		process.env.NEXT_PUBLIC_BASE_URL
	}/photo-booth/mobile/details?${params.toString()}`;
	console.log('Generated QR Code URL:', url);
	return await QRCode.toDataURL(url);
}
