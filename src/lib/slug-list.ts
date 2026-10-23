/** Reads a comma-separated slug list from the URL into a fixed number of slots. */
export const parseSlugList = (
	value: string | null,
	size: number,
	valid: (s: string) => boolean
) => {
	const slugs = (value ?? '').split(',').map((s) => (s && valid(s) ? s : null));
	return Array.from({ length: size }, (_, i) => slugs[i] ?? null);
};
