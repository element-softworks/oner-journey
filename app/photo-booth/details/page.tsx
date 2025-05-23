import { PhotoBoothContainer } from '@/components/photo-booth-container';

export default function PhotoBoothFormPage({
	searchParams,
}: {
	searchParams: { sessionId: string; name: string; email: string };
}) {
	return (
		<div className="min-h-[100dvh] w-full  flex items-center justify-center">
			<PhotoBoothContainer
				initialScreen="details"
				sessionId={searchParams.sessionId}
				name={searchParams.name}
				email={searchParams.email}
			/>
		</div>
	);
}
