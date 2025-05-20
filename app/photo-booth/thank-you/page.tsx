import { PhotoBoothContainer } from '@/components/photo-booth-container';
import { useEffect } from 'react';

export default function PhotoBoothThankYouPage({
	searchParams,
}: {
	searchParams: { sessionId: string; photoUrl: string; email: string };
}) {
	//We want to navigate back to the home page after 5 seconds

	return (
		<div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-white relative overflow-hidden">
				<PhotoBoothContainer initialScreen="thank-you" sessionId={searchParams.sessionId} />
			</div>
		</div>
	);
}
