import { PhotoBoothContainer } from '@/components/photo-booth-container';

export default function PhotoBoothFormPage({
	searchParams,
}: {
	searchParams: { sessionId: string; name: string; email: string };
}) {
	return (
		<div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-white relative overflow-hidden">
				<PhotoBoothContainer
					initialScreen="welcome"
					sessionId={searchParams.sessionId}
					name={searchParams.name}
					email={searchParams.email}
				/>
			</div>
		</div>
	);
}
