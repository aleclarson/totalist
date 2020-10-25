import { join, resolve } from 'path';
import { lstatSync, readdirSync, realpathSync } from 'fs';

function walk(dir, stats, callback, cache, prefix) {
	if (!stats.isSymbolicLink() || !cache.has(dir = realpathSync(dir))) {
		cache.add(dir);
		let i=0, abs, xyz;
		let arr = readdirSync(dir);
		for (; i < arr.length; i++) {
			xyz = lstatSync(abs = join(dir, arr[i]));
			xyz.isDirectory()
				? walk(abs, xyz, callback, cache, join(prefix, arr[i]))
				: callback(join(prefix, arr[i]), abs, xyz);
		}
	}
}

export function totalist(dir, callback, prefix) {
	let stats = lstatSync(dir = resolve('.', dir));
	if (stats.isDirectory()) walk(dir, stats, callback, new Set, prefix || '');
}
