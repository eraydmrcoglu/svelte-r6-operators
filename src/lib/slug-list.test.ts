import { describe, expect, it } from 'vitest';
import { parseSlugList } from './slug-list';

describe('parseSlugList', () => {
	it('pads, truncates and drops invalid slugs', () => {
		const valid = (s: string) => s !== 'nope';
		expect(parseSlugList('ash,nope,,sledge', 3, valid)).toEqual(['ash', null, null]);
		expect(parseSlugList(null, 2, valid)).toEqual([null, null]);
	});
});
