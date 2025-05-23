import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobileDetailsPage({
	searchParams,
}: {
	searchParams: { sessionId: string; email?: string; name?: string };
}) {
	return (
		<div className="min-h-[100dvh] h-full w-full bg-[#1C4639] flex items-center justify-center">
			<PhotoBoothMobileContainer initialScreen="details" sessionId={searchParams.sessionId} />
		</div>
	);
}
