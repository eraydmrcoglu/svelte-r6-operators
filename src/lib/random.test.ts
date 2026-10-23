import { describe, expect, it } from 'vitest';
import { pick, randomLoadout } from './random';
import type { Operator } from './types';

describe('pick', () => {
	it('returns undefined for an empty list', () => {
		expect(pick([])).toBeUndefined();
	});
	it('maps the random value onto the list', () => {
		expect(pick(['a', 'b', 'c'], () => 0.99)).toBe('c');
	});
});

describe('randomLoadout', () => {
	it('picks one item per slot and tolerates empty slots', () => {
		const item = (name: string) => ({ name, slug: name, remoteImage: null });
		const op = { primaries: [item('F2'), item('417')], secondaries: [], gadgets: [item('Frag')] };
		expect(randomLoadout(op as unknown as Operator, () => 0)).toEqual({
			primary: item('F2'),
			secondary: undefined,
			gadget: item('Frag')
		});
	});
});
