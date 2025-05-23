import { AppContainer } from '@/components/app-container';

export default function OutfitSelectorPage({ searchParams }: { searchParams: any }) {
	return (
		<div className="min-h-[100dvh] w-full bg-[#5B7FCA] flex items-center justify-center">
			<AppContainer searchParams={searchParams} />
		</div>
	);
}
