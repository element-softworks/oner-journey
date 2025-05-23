import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobileCaptureePage({
	searchParams,
}: {
	searchParams: { sessionId: string };
}) {
	return (
		<div className="min-h-[100dvh] h-full w-full bg-[#1C4639] flex items-center justify-center">
			<PhotoBoothMobileContainer initialScreen="capture" sessionId={searchParams.sessionId} />
		</div>
	);
}
