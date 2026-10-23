// Helpers shared by the ubisoft.com sync scripts.
import { access, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const GAME_INFO = 'https://www.ubisoft.com/en-us/game/rainbow-six/siege/game-info';
const UA = { 'user-agent': 'Mozilla/5.0 (r6-operators fan site sync script)' };

export const slugify = (s) =>
	s
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[øØ]/g, 'o')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');

export async function get(url) {
	for (let attempt = 1; ; attempt++) {
		const res = await fetch(url, { headers: UA });
		if (res.ok) return res;
		if (attempt === 3) throw new Error(`${res.status} ${url}`);
		await new Promise((r) => setTimeout(r, 1000 * attempt));
	}
}

/** Fetches a ubisoft.com page and returns its embedded __PRELOADED_STATE__ JSON. */
export async function pageState(url) {
	const html = await (await get(url)).text();
	const m = html.match(/window\.__PRELOADED_STATE__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/);
	if (!m) throw new Error(`No __PRELOADED_STATE__ in ${url}`);
	return { html, state: JSON.parse(m[1]) };
}

export function findKey(obj, key) {
	if (!obj || typeof obj !== 'object') return undefined;
	if (key in obj) return obj[key];
	for (const v of Object.values(obj)) {
		const r = findKey(v, key);
		if (r) return r;
	}
}

/** Slugs linked from a listing page, e.g. /game-info/maps/<slug>. */
export const linkedSlugs = (html, section) => [
	...new Set(
		[...html.matchAll(new RegExp(`/game-info/${section}/([a-z0-9-]+)`, 'g'))].map((m) => m[1])
	)
];

export const cleanText = (s) =>
	s.replace(/\\\[/g, '[').replace(/\\\]/g, ']').replace(/\*+/g, '').replace(/\s+\n/g, '\n').trim();

/** Downloads an image once and stores it as WebP under static/. */
export async function saveImage(url, file, resize) {
	if (!url) return false;
	const out = join(ROOT, 'static', file);
	try {
		await access(out);
		return true;
	} catch {}
	const sharp = (await import('sharp')).default;
	const buf = Buffer.from(await (await get(url)).arrayBuffer());
	await mkdir(dirname(out), { recursive: true });
	await sharp(buf).resize(resize).webp({ quality: 82 }).toFile(out);
	return true;
}

export async function writeJson(file, data) {
	await writeFile(join(ROOT, file), JSON.stringify(data, null, '\t') + '\n');
}
