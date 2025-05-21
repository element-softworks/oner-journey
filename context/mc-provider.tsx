'use client';

import { MerlinCloudProvider } from '@merlincloud/mc-package';
import { ReactNode } from 'react';

export function MCProvider({ children }: { children: ReactNode }) {
	return <MerlinCloudProvider environment="native">{children}</MerlinCloudProvider>;
}
