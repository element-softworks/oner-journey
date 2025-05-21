import { PhotoBoothMobileContainer } from '@/components/screens/photo-booth-mobile-container';

export default function PhotoBoothMobileDetailsPage({
	searchParams,
}: {
	searchParams: { sessionId: string; email?: string; name?: string };
}) {
	return (
		<div className="min-h-screen w-full bg-[#1C4639] flex items-center justify-center">
			<div className="h-screen w-full max-w-md bg-[#1C4639] relative overflow-hidden">
				<PhotoBoothMobileContainer
					initialScreen="details"
					sessionId={searchParams.sessionId}
				/>
			</div>
		</div>
	);
}
