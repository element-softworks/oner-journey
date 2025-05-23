import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobilePreviewPage({
	searchParams,
}: {
	searchParams: { sessionId: string };
}) {
	return (
		<div className="min-h-[100dvh] h-[100%] w-full bg-[#1C4639] flex items-center justify-center ">
			<PhotoBoothMobileContainer initialScreen="preview" sessionId={searchParams.sessionId} />
		</div>
	);
}
