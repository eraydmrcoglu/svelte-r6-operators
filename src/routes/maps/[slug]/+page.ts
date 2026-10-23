import { error } from '@sveltejs/kit';
import { getMap, maps } from '$lib/data/maps';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => maps.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const map = getMap(params.slug);
	if (!map) error(404, 'Map not found');
	const i = maps.indexOf(map);
	return { map, prev: maps.at(i - 1)!, next: maps[(i + 1) % maps.length] };
};
