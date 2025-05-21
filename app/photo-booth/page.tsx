import { PhotoBoothContainer } from '@/components/photo-booth-container';

export default function PhotoBoothPage({
	searchParams,
}: {
	searchParams: { sessionId: string; name: string; email: string };
}) {
	return (
		<div className="min-h-screen w-full bg-[#1C4639] flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-[#1C4639] relative overflow-hidden">
				<PhotoBoothContainer
					sessionId={searchParams.sessionId}
					name={searchParams.name}
					email={searchParams.email}
				/>
			</div>
		</div>
	);
}
