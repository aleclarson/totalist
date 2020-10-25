import { join, resolve } from 'path';
import { lstat, readdir, realpath } from 'fs';
import { promisify } from 'util';

const real = promisify(realpath);
const toStats = promisify(lstat);
const list = promisify(readdir);

async function walk(dir, stats, callback, cache, prefix) {
	if (!stats.isSymbolicLink() || !cache.has(dir = await real(dir))) {
		cache.add(dir) && await list(dir).then(arr => Promise.all(
			arr.map(str => {
				let abs = join(dir, str);
				return toStats(abs).then(xyz => {
					return xyz.isDirectory()
						? walk(abs, xyz, callback, cache, join(prefix, str))
						: callback(join(prefix, str), abs, xyz)
				});
			})
		));
	}
}

export async function totalist(dir, callback, prefix) {
	let stats = await toStats(dir = resolve('.', dir));
	if (stats.isDirectory()) await walk(dir, stats, callback, new Set, prefix || '');
}
