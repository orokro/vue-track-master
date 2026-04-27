/**
 * @file VueTrackMaster - viewport-aware filtering helpers for consumer
 * components. v1 of `filterVisible` from the design discussion.
 *
 * Used inside a clip body (or anywhere under <VueTrackMaster>) to
 * cull a list of items down to those intersecting the visible range.
 *
 * Usage:
 *
 *   import { filterVisible } from '@/lib/composables/use-viewport.js';
 *
 *   const visibleNotes = filterVisible(myNotes, n => [n.start, n.end]);
 *   // visibleNotes is a computed; iterate it in v-for
 *
 * Performance notes:
 *   - For sorted data with O(log n) cull, pass `{ sorted: true }`. The
 *     accessor must return ranges sorted by start time.
 *   - For now (v0) we do an O(n) filter every viewport change. Sorted
 *     index / interval tree is a follow-up.
 */

import { computed } from 'vue';
import { useEditor } from './use-editor.js';

/**
 * @template T
 * @param {import('vue').MaybeRefOrGetter<Iterable<T>>} source
 * @param {(item: T) => [number, number]} rangeOf
 * @param {Object} [opts]
 * @param {[number, number]} [opts.bounds]
 *   Override viewport — useful inside a clip to cull relative to clip
 *   visible bounds rather than editor viewport.
 * @returns {import('vue').ComputedRef<{ items: T[], allVisible: boolean, noneVisible: boolean }>}
 */
export function filterVisible(source, rangeOf, opts = {}) {
	const editor = useEditor();
	return computed(() => {
		const list = unwrap(source);
		const [vs, ve] = opts.bounds
			?? [editor.viewportStart.value, editor.viewportEnd.value];
		const items = [];
		let allIn = true;
		for (const item of list) {
			const [s, e] = rangeOf(item);
			const inView = e >= vs && s <= ve;
			if (inView) items.push(item);
			else allIn = false;
		}
		return {
			items,
			allVisible: allIn && items.length > 0,
			noneVisible: items.length === 0,
		};
	});
}

function unwrap(src) {
	if (typeof src === 'function') return src();
	if (src && typeof src === 'object' && 'value' in src) return src.value;
	return src;
}
