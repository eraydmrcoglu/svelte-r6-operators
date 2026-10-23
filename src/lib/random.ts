import type { LoadoutItem, Operator } from './types';

export type Rand = () => number;

export function pick<T>(items: readonly T[], rand: Rand = Math.random): T | undefined {
	return items.length ? items[Math.floor(rand() * items.length)] : undefined;
}

export type RandomLoadout = {
	primary?: LoadoutItem;
	secondary?: LoadoutItem;
	gadget?: LoadoutItem;
};

export const randomLoadout = (op: Operator, rand: Rand = Math.random): RandomLoadout => ({
	primary: pick(op.primaries, rand),
	secondary: pick(op.secondaries, rand),
	gadget: pick(op.gadgets, rand)
});
