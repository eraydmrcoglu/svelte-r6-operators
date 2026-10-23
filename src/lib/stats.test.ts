import { describe, expect, it } from 'vitest';
import { countBy, trackerUrl } from './stats';
import type { Operator } from './types';

describe('trackerUrl', () => {
	it('encodes the username and trims whitespace', () => {
		expect(trackerUrl('ubi', ' Beaulo.TSM ')).toBe(
			'https://r6.tracker.network/r6siege/profile/ubi/Beaulo.TSM/overview'
		);
		expect(trackerUrl('psn', 'a b/c')).toContain('/psn/a%20b%2Fc/');
	});
});

describe('countBy', () => {
	it('counts scalar and array keys, most common first', () => {
		const ops = [
			{ side: 'attack', roles: ['breach', 'support'] },
			{ side: 'attack', roles: ['support'] },
			{ side: 'defense', roles: ['support'] }
		] as Operator[];
		expect(countBy(ops, (o) => o.side)).toEqual([
			['attack', 2],
			['defense', 1]
		]);
		expect(countBy(ops, (o) => o.roles)).toEqual([
			['support', 3],
			['breach', 1]
		]);
	});
});
