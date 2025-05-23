import { AppContainer } from '@/components/app-container';

export default function IntroPage({ searchParams }: { searchParams: any }) {
	return (
		<div className="min-h-[100dvh] w-full bg-gray-50 flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-white relative overflow-hidden">
				<AppContainer searchParams={searchParams} />
			</div>
		</div>
	);
}
