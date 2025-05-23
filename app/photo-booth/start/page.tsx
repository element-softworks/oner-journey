import { PhotoBoothContainer } from '@/components/photo-booth-container';

export default function PhotoBoothStartPage({
	searchParams,
}: {
	searchParams: { sessionId: string; name: string; email: string };
}) {
	return (
		<div className="min-h-[100dvh] w-full bg-[#1C4639] flex items-center justify-center">
			<PhotoBoothContainer
				initialScreen="landing"
				sessionId={searchParams.sessionId}
				name={searchParams.name}
				email={searchParams.email}
			/>
		</div>
	);
}
