// Pulls the operator roster from ubisoft.com and writes src/lib/data/operators.json.
// Usage:
//   node scripts/sync-operators.mjs            -> data only
//   node scripts/sync-operators.mjs --images   -> data + portraits, badges and loadout images (WebP)
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
	GAME_INFO,
	ROOT,
	cleanText,
	findKey,
	linkedSlugs,
	pageState,
	saveImage,
	slugify,
	writeJson
} from './lib.mjs';

const BASE = `${GAME_INFO}/operators`;
const withImages = process.argv.includes('--images');

// ubisoft.com leaves some weapon subtypes blank, and a few biographies empty.
const WEAPON_TYPES = {
	'9X19SVN': 'submachine gun',
	'G52-Tactical Shield': 'shield',
	'CCE SHIELD MK2': 'shield',
	'Ballistic Shield': 'shield',
	'LE ROC SHIELD': 'shield',
	PMR90A2: 'marksman rifle',
	XK23: 'assault rifle',
	'Glaive-12': 'shotgun',
	UZK50Gi: 'submachine gun',
	'Reaper MK2': 'machine pistol',
	Luison: 'handgun',
	'TACIT .45': 'handgun'
};
const BIO_FALLBACKS = JSON.parse(await readFile(join(ROOT, 'scripts/bio-fallbacks.json'), 'utf8'));

// "### BIOGRAPHY\n\n..." -> [{ title, paragraphs }]
function parseBiography(md = '') {
	const sections = [];
	for (const block of md.split(/\n{2,}/)) {
		const heading = block.match(/^#+\s*(.+)$/);
		if (heading) sections.push({ title: heading[1].trim(), paragraphs: [] });
		else if (block.trim()) {
			if (!sections.length) sections.push({ title: 'BIOGRAPHY', paragraphs: [] });
			sections.at(-1).paragraphs.push(cleanText(block));
		}
	}
	return sections;
}

// Portraits come in a few aspect ratios. Cropping them all to one frame, anchored at the
// top, keeps heads at the same height and scale across cards.
const PORTRAIT = { width: 720, height: 616, fit: 'cover', position: 'top' };

async function syncOperator(slug) {
	const { state } = await pageState(`${BASE}/${slug}`);
	const details = findKey(state, `OperatorDetailsContainer-${slug}`)?.content;
	if (!details) throw new Error(`No details for ${slug}`);
	const { header, loadout = [] } = details;

	const pick = (type) => loadout.filter((l) => l.weaponType === type);
	const item = (l) => {
		const name = l.title.trim();
		const type = l.weaponSubtype?.trim().toLowerCase() || WEAPON_TYPES[name];
		return {
			name,
			slug: slugify(name),
			...(type ? { type } : {}),
			remoteImage: l.weaponImage?.url ?? null
		};
	};
	const ability = pick('unique-ability')[0];
	const roles = header.roles ?? [];
	const biography = parseBiography(header.biography);
	if (!biography.length && BIO_FALLBACKS[slug])
		biography.push({ title: 'BIOGRAPHY', paragraphs: [BIO_FALLBACKS[slug]] });

	return {
		slug,
		name: header.operatorName.trim(),
		side: header.isAttacker ? 'attack' : 'defense',
		roles: roles.filter((r) => r !== 'starter-operators'),
		starter: roles.includes('starter-operators'),
		armor: header.armor,
		speed: header.speed,
		difficulty: header.difficulty,
		realName: header.realName ?? null,
		dateOfBirth: header.dateOfBirth ?? null,
		placeOfBirth: header.placeOfBirth ?? null,
		ability: {
			name: ability?.title.trim() ?? null,
			description: cleanText(header.ability?.content ?? ''),
			remoteImage: ability?.weaponImage?.url ?? null
		},
		primaries: pick('primary').map(item),
		secondaries: pick('secondary').map(item),
		gadgets: pick('gadget').map(item),
		biography,
		remotePortrait: header.operatorImage?.url ?? null,
		remoteBadge: header.operatorIcon?.url ?? null
	};
}

const slugs = linkedSlugs((await pageState(BASE)).html, 'operators');
console.log(`Found ${slugs.length} operators`);

const operators = [];
for (const slug of slugs) {
	try {
		operators.push(await syncOperator(slug));
		process.stdout.write('.');
	} catch (e) {
		console.error(`\n${slug}: ${e.message}`);
	}
}
operators.sort((a, b) => a.name.localeCompare(b.name));

if (withImages) {
	console.log('\nDownloading images…');
	for (const op of operators) {
		await saveImage(op.remotePortrait, `operators/${op.slug}/portrait.webp`, PORTRAIT);
		await saveImage(op.remoteBadge, `operators/${op.slug}/badge.webp`, {
			width: 160,
			withoutEnlargement: true
		});
		await saveImage(op.ability.remoteImage, `operators/${op.slug}/ability.webp`, {
			width: 320,
			withoutEnlargement: true
		});
		for (const l of [...op.primaries, ...op.secondaries, ...op.gadgets])
			await saveImage(l.remoteImage, `loadout/${l.slug}.webp`, {
				width: 480,
				withoutEnlargement: true
			});
		process.stdout.write('.');
	}
}

await writeJson('src/lib/data/operators.json', operators);
console.log(`\nWrote ${operators.length} operators to src/lib/data/operators.json`);
