import { describe, expect, it } from 'vitest';
import { applyFilters, emptyFilters, parseFilters, serializeFilters } from './filters';
import type { Operator } from './types';

const op = (o: Partial<Operator> & Pick<Operator, 'name'>): Operator => ({
	slug: o.name.toLowerCase(),
	side: 'attack',
	roles: [],
	starter: false,
	armor: 2,
	speed: 2,
	difficulty: 1,
	realName: null,
	dateOfBirth: null,
	placeOfBirth: null,
	ability: { name: null, description: '', remoteImage: null },
	primaries: [],
	secondaries: [],
	gadgets: [],
	biography: [],
	squad: null,
	season: { code: 'Launch', name: 'Launch', year: 0, order: 0 },
	isNew: false,
	portrait: '',
	badge: '',
	...o
});

const ops = [
	op({ name: 'Ash', armor: 1, speed: 3, roles: ['breach', 'front-line'], squad: 'Redhammer' }),
	op({
		name: 'Nøkk',
		side: 'attack',
		roles: ['intel'],
		season: { code: 'Y4S2', name: 'Phantom Sight', year: 4, order: 14 },
		primaries: [{ name: 'FMG-9', slug: 'fmg-9', remoteImage: null }]
	}),
	op({
		name: 'Noor',
		side: 'defense',
		roles: ['anti-entry', 'crowd-control'],
		season: { code: 'Y11S3', name: 'Split Fire', year: 11, order: 38 }
	})
];

const names = (list: Operator[]) => list.map((o) => o.name);

describe('applyFilters', () => {
	it('returns everything sorted by name with no filters', () => {
		expect(names(applyFilters(ops, emptyFilters()))).toEqual(['Ash', 'Nøkk', 'Noor']);
	});

	it('searches names ignoring diacritics, and weapons', () => {
		expect(names(applyFilters(ops, { ...emptyFilters(), q: 'nokk' }))).toEqual(['Nøkk']);
		expect(names(applyFilters(ops, { ...emptyFilters(), q: 'fmg' }))).toEqual(['Nøkk']);
	});

	it('combines side, role and stat filters', () => {
		expect(names(applyFilters(ops, { ...emptyFilters(), side: 'defense' }))).toEqual(['Noor']);
		expect(names(applyFilters(ops, { ...emptyFilters(), roles: ['breach'], speed: 3 }))).toEqual([
			'Ash'
		]);
		expect(applyFilters(ops, { ...emptyFilters(), roles: ['breach'], speed: 1 })).toEqual([]);
	});

	it('requires every selected role', () => {
		const f = { ...emptyFilters(), roles: ['anti-entry', 'crowd-control'] };
		expect(names(applyFilters(ops, f))).toEqual(['Noor']);
	});

	it('sorts by release', () => {
		expect(names(applyFilters(ops, { ...emptyFilters(), sort: 'newest' }))).toEqual([
			'Noor',
			'Nøkk',
			'Ash'
		]);
	});

	it('limits to favorites', () => {
		const f = { ...emptyFilters(), favorites: true };
		expect(names(applyFilters(ops, f, ['noor']))).toEqual(['Noor']);
	});
});

describe('URL round-trip', () => {
	it('omits defaults and restores every field', () => {
		expect(serializeFilters(emptyFilters()).toString()).toBe('');
		const f = {
			...emptyFilters(),
			q: 'ash',
			side: 'attack' as const,
			roles: ['breach', 'intel'],
			armor: 1,
			speed: 3,
			squad: 'Redhammer',
			year: 0,
			favorites: true,
			sort: 'newest' as const
		};
		expect(parseFilters(serializeFilters(f))).toEqual(f);
	});

	it('ignores invalid values', () => {
		const f = parseFilters(new URLSearchParams('side=both&health=9&speed=x&sort=random'));
		expect(f).toEqual(emptyFilters());
	});
});
