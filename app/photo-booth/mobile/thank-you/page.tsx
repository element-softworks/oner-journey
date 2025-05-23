import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobileThankYouPage({
	searchParams,
}: {
	searchParams: { sessionId: string };
}) {
	return (
		<div className="min-h-[100dvh] w-full bg-[#1C4639] flex items-center justify-center">
			<div className="h-screen w-full max-w-md bg-[#1C4639] relative overflow-hidden">
				<PhotoBoothMobileContainer
					initialScreen="thank-you"
					sessionId={searchParams.sessionId}
				/>
			</div>
		</div>
	);
}
