// Pulls the map pool from ubisoft.com and writes src/lib/data/maps.json.
// Usage:
//   node scripts/sync-maps.mjs            -> data only
//   node scripts/sync-maps.mjs --images   -> data + thumbnails and header art (WebP)
import {
	GAME_INFO,
	cleanText,
	findKey,
	linkedSlugs,
	pageState,
	saveImage,
	writeJson
} from './lib.mjs';

const BASE = `${GAME_INFO}/maps`;
const withImages = process.argv.includes('--images');

const titleCase = (s) => s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase());

async function syncMap(slug) {
	const { state } = await pageState(`${BASE}/${slug}`);
	const content = findKey(state, `MapDetailsContainer-${slug}`)?.content;
	if (!content?.mapDetails) throw new Error(`No details for ${slug}`);
	const d = content.mapDetails;
	return {
		slug,
		name: d.title.trim(),
		location: d.location ? titleCase(d.location.trim()) : null,
		released: d.released?.trim() || null,
		reworked: d.reworked?.trim() || null,
		description: cleanText(d.content ?? ''),
		playlists: content.playlists ?? [],
		blueprints: d.blueprintsButton?.buttonUrl ?? null,
		remoteThumbnail: content.mapThumbnail?.url ?? null,
		remoteImage: d.headerMediaButton?.buttonImage?.url ?? null
	};
}

const slugs = linkedSlugs((await pageState(BASE)).html, 'maps');
console.log(`Found ${slugs.length} maps`);

const maps = [];
for (const slug of slugs) {
	try {
		maps.push(await syncMap(slug));
		process.stdout.write('.');
	} catch (e) {
		console.error(`\n${slug}: ${e.message}`);
	}
}
maps.sort((a, b) => a.name.localeCompare(b.name));

if (withImages) {
	console.log('\nDownloading images…');
	for (const map of maps) {
		await saveImage(map.remoteThumbnail, `maps/${map.slug}/thumb.webp`, {
			width: 640,
			height: 360,
			fit: 'cover'
		});
		await saveImage(map.remoteImage, `maps/${map.slug}/hero.webp`, {
			width: 1600,
			withoutEnlargement: true
		});
		process.stdout.write('.');
	}
}

await writeJson('src/lib/data/maps.json', maps);
console.log(`\nWrote ${maps.length} maps to src/lib/data/maps.json`);
