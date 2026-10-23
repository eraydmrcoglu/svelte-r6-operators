const KEY = 'r6-favorites';

function load(): string[] {
	try {
		const v = JSON.parse(localStorage.getItem(KEY) ?? '[]');
		return Array.isArray(v) ? v.filter((s) => typeof s === 'string') : [];
	} catch {
		return [];
	}
}

class Favorites {
	slugs = $state<string[]>([]);

	init() {
		this.slugs = load();
	}

	has(slug: string) {
		return this.slugs.includes(slug);
	}

	toggle(slug: string) {
		this.slugs = this.has(slug) ? this.slugs.filter((s) => s !== slug) : [...this.slugs, slug];
		try {
			localStorage.setItem(KEY, JSON.stringify(this.slugs));
		} catch {}
	}
}

export const favorites = new Favorites();
