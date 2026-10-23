import type { Operator } from './types';

export type Platform = 'ubi' | 'psn' | 'xbl';

export const PLATFORMS: { value: Platform; label: string }[] = [
	{ value: 'ubi', label: 'PC (Ubisoft)' },
	{ value: 'psn', label: 'PlayStation' },
	{ value: 'xbl', label: 'Xbox' }
];

export const trackerUrl = (platform: Platform, username: string) =>
	`https://r6.tracker.network/r6siege/profile/${platform}/${encodeURIComponent(username.trim())}/overview`;

/** Counts how many operators fall into each bucket, sorted by count. */
export function countBy(operators: Operator[], key: (op: Operator) => string | string[]) {
	const counts = new Map<string, number>();
	for (const op of operators)
		for (const k of [key(op)].flat()) counts.set(k, (counts.get(k) ?? 0) + 1);
	return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
