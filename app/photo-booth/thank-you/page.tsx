import { PhotoBoothContainer } from '@/components/photo-booth-container';
import { useEffect } from 'react';

export default function PhotoBoothThankYouPage({
	searchParams,
}: {
	searchParams: { sessionId: string; name: string; email: string };
}) {
	//We want to navigate back to the home page after 5 seconds

	return (
		<div className="min-h-screen w-full bg-[#1C4639] flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-[#1C4639] relative overflow-hidden">
				<PhotoBoothContainer
					initialScreen="thank-you"
					sessionId={searchParams.sessionId}
					name={searchParams.name}
					email={searchParams.email}
				/>
			</div>
		</div>
	);
}
