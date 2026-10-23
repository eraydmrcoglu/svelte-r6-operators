import raw from './operators.json';
import type { Operator, Side } from '$lib/types';
import { seasonOf, seasons, squadOf } from './meta';

const currentYear = seasons.at(-1)!.year;

export const operators: Operator[] = raw.map((op) => ({
	...op,
	side: op.side as Side,
	squad: squadOf(op.slug),
	season: seasonOf(op.slug),
	isNew: seasonOf(op.slug).year === currentYear,
	portrait: `/operators/${op.slug}/portrait.webp`,
	badge: `/operators/${op.slug}/badge.webp`
}));

export const getOperator = (slug: string) => operators.find((op) => op.slug === slug);

export const ROLES = [...new Set(operators.flatMap((op) => op.roles))].sort();
export const SQUADS = [...new Set(operators.flatMap((op) => (op.squad ? [op.squad] : [])))].sort();
