export type Side = 'attack' | 'defense';

export type LoadoutItem = {
	name: string;
	slug: string;
	type?: string;
	remoteImage: string | null;
};

export type BiographySection = {
	title: string;
	paragraphs: string[];
};

export type Season = {
	code: string;
	name: string;
	year: number;
	order: number;
};

export type Operator = {
	slug: string;
	name: string;
	side: Side;
	roles: string[];
	starter: boolean;
	armor: number;
	speed: number;
	difficulty: number;
	realName: string | null;
	dateOfBirth: string | null;
	placeOfBirth: string | null;
	ability: { name: string | null; description: string; remoteImage: string | null };
	primaries: LoadoutItem[];
	secondaries: LoadoutItem[];
	gadgets: LoadoutItem[];
	biography: BiographySection[];
	squad: string | null;
	season: Season;
	/** Released in the current game year. */
	isNew: boolean;
	portrait: string;
	badge: string;
};

export type GameMap = {
	slug: string;
	name: string;
	location: string | null;
	released: string | null;
	reworked: string | null;
	description: string;
	playlists: string[];
	blueprints: string | null;
	thumbnail: string;
	hero: string;
};
