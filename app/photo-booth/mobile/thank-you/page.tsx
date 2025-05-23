import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobileThankYouPage({
	searchParams,
}: {
	searchParams: { sessionId: string };
}) {
	return (
		<div className="min-h-[100dvh] h-full w-full bg-[#1C4639] flex items-center justify-center">
			<PhotoBoothMobileContainer
				initialScreen="thank-you"
				sessionId={searchParams.sessionId}
			/>
		</div>
	);
}
