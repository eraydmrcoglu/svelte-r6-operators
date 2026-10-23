import raw from './maps.json';
import type { GameMap } from '$lib/types';

export const maps: GameMap[] = raw.map((m) => ({
	...m,
	thumbnail: `/maps/${m.slug}/thumb.webp`,
	hero: `/maps/${m.slug}/hero.webp`
}));

export const getMap = (slug: string) => maps.find((m) => m.slug === slug);

export const PLAYLISTS: Record<string, string> = {
	ranked: 'Ranked',
	quickmatch: 'Quick Match',
	unranked: 'Unranked',
	teamdeathmatch: 'Team Deathmatch'
};
