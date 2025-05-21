import { AppContainer } from '@/components/app-container';

export default function CompletePage() {
	return (
		<div className="min-h-screen w-full bg-[#5B7FCA] flex items-center justify-center">
			<div className="h-screen w-[56.25vh] bg-[#5B7FCA] relative overflow-hidden">
				<AppContainer />
			</div>
		</div>
	);
}
