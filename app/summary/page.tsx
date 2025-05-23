import { AppContainer } from '@/components/app-container';

export default function SummaryPage({ searchParams }: { searchParams: any }) {
	return (
		<div className="min-h-[100dvh]  w-full bg-gray-50 flex items-center justify-center h-full">
			<AppContainer searchParams={searchParams} />
		</div>
	);
}
