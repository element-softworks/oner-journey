import { useMerlinSession } from '@merlincloud/mc-package';

export const useTrackEvent = () => {
	const { trackInteraction: trackMerlinInteraction } = useMerlinSession();
	type InteractionRecords = Parameters<typeof trackMerlinInteraction>['2'];

	const devAnalytics = process.env.REACT_APP_ENABLE_DEV_ANALYTICS === 'true';

	return (category: string, action: string, records: InteractionRecords, converting = false) => {
		// Do nothing if we're not tracking analytics in dev mode
		if (process.env.NODE_ENV === 'development' && !devAnalytics) {
			console.log('Not logging interaction', devAnalytics);
		}

		trackMerlinInteraction(action, category, records, converting);
	};
};
