import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobilePreviewPage({
	searchParams,
}: {
	searchParams: { sessionId: string };
}) {
	return (
		<div className="min-h-screen w-full bg-white flex items-center justify-center">
			<div className="h-screen w-full max-w-md bg-white relative overflow-hidden">
				<PhotoBoothMobileContainer
					initialScreen="preview"
					sessionId={searchParams.sessionId}
				/>
			</div>
		</div>
	);
}
