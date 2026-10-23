import type { Operator, Side } from './types';

export type SortKey = 'name' | 'newest' | 'oldest';

export type Filters = {
	q: string;
	side: Side | null;
	roles: string[];
	armor: number | null;
	speed: number | null;
	squad: string | null;
	year: number | null;
	favorites: boolean;
	sort: SortKey;
};

export const emptyFilters = (): Filters => ({
	q: '',
	side: null,
	roles: [],
	armor: null,
	speed: null,
	squad: null,
	year: null,
	favorites: false,
	sort: 'name'
});

const int = (v: string | null, min: number, max: number) => {
	const n = v === null ? NaN : Number(v);
	return Number.isInteger(n) && n >= min && n <= max ? n : null;
};

export function parseFilters(params: URLSearchParams): Filters {
	const side = params.get('side');
	const sort = params.get('sort');
	return {
		q: params.get('q') ?? '',
		side: side === 'attack' || side === 'defense' ? side : null,
		roles: params.get('roles')?.split(',').filter(Boolean) ?? [],
		armor: int(params.get('health'), 1, 3),
		speed: int(params.get('speed'), 1, 3),
		squad: params.get('squad') || null,
		year: int(params.get('year'), 0, 99),
		favorites: params.get('fav') === '1',
		sort: sort === 'newest' || sort === 'oldest' ? sort : 'name'
	};
}

export function serializeFilters(f: Filters): URLSearchParams {
	const p = new URLSearchParams();
	if (f.q.trim()) p.set('q', f.q.trim());
	if (f.side) p.set('side', f.side);
	if (f.roles.length) p.set('roles', f.roles.join(','));
	if (f.armor !== null) p.set('health', String(f.armor));
	if (f.speed !== null) p.set('speed', String(f.speed));
	if (f.squad) p.set('squad', f.squad);
	if (f.year !== null) p.set('year', String(f.year));
	if (f.favorites) p.set('fav', '1');
	if (f.sort !== 'name') p.set('sort', f.sort);
	return p;
}

export const activeFilterCount = (f: Filters) =>
	[f.side, f.armor, f.speed, f.squad, f.year].filter((v) => v !== null).length +
	f.roles.length +
	Number(f.favorites);

const normalize = (s: string) =>
	s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ø/gi, 'o').toLowerCase();

function matchesQuery(op: Operator, q: string) {
	if (!q) return true;
	const haystack = [
		op.name,
		op.realName ?? '',
		op.ability.name ?? '',
		...op.primaries.map((w) => w.name),
		...op.secondaries.map((w) => w.name)
	];
	return haystack.some((s) => normalize(s).includes(q));
}

export function applyFilters(
	operators: Operator[],
	f: Filters,
	favoriteSlugs: string[] = []
): Operator[] {
	const q = normalize(f.q.trim());
	const result = operators.filter(
		(op) =>
			matchesQuery(op, q) &&
			(!f.side || op.side === f.side) &&
			f.roles.every((r) => op.roles.includes(r)) &&
			(f.armor === null || op.armor === f.armor) &&
			(f.speed === null || op.speed === f.speed) &&
			(!f.squad || op.squad === f.squad) &&
			(f.year === null || op.season.year === f.year) &&
			(!f.favorites || favoriteSlugs.includes(op.slug))
	);
	const byName = (a: Operator, b: Operator) => a.name.localeCompare(b.name);
	if (f.sort === 'name') return result.sort(byName);
	const dir = f.sort === 'newest' ? -1 : 1;
	return result.sort((a, b) => dir * (a.season.order - b.season.order) || byName(a, b));
}

export const roleLabel = (role: string) =>
	role.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
