export type RankTier = {
	name: string;
	color: string;
	/** Divisions from lowest to highest; empty for single-step tiers. */
	divisions: string[];
	blurb: string;
};

const FIVE = ['V', 'IV', 'III', 'II', 'I'];

// Ladder from lowest to highest. RP cut-offs change between ranked versions, so they are left out.
export const tiers: RankTier[] = [
	{ name: 'Copper', color: '#b4613f', divisions: FIVE, blurb: 'Where everyone learns the basics.' },
	{ name: 'Bronze', color: '#c48a4c', divisions: FIVE, blurb: 'Map knowledge starts to matter.' },
	{ name: 'Silver', color: '#b9c3cd', divisions: FIVE, blurb: 'Utility use and callouts kick in.' },
	{ name: 'Gold', color: '#e9b824', divisions: FIVE, blurb: 'Solid fundamentals, real strats.' },
	{
		name: 'Platinum',
		color: '#42c8c0',
		divisions: FIVE,
		blurb: 'Coordinated teams, punishing peeks.'
	},
	{ name: 'Emerald', color: '#33cc75', divisions: FIVE, blurb: 'Sharp aim and fast reads.' },
	{ name: 'Diamond', color: '#b28dff', divisions: FIVE, blurb: 'Near-pro decision making.' },
	{ name: 'Champion', color: '#ff3d5e', divisions: [], blurb: 'The top of the standard ladder.' },
	{
		name: 'Legend',
		color: '#ffd36b',
		divisions: [],
		blurb: 'Solo-queue division above Champion for the very best.'
	}
];
