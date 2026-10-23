import { error } from '@sveltejs/kit';
import { getOperator, operators } from '$lib/data';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => operators.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const operator = getOperator(params.slug);
	if (!operator) error(404, 'Operator not found');

	// Prev/next follow alphabetical order within the same side.
	const sameSide = operators
		.filter((op) => op.side === operator.side)
		.sort((a, b) => a.name.localeCompare(b.name));
	const i = sameSide.indexOf(operator);
	return {
		operator,
		prev: sameSide.at(i - 1)!,
		next: sameSide[(i + 1) % sameSide.length]
	};
};
