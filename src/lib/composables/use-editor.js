/**
 * @file VueTrackMaster - editor context (provide/inject).
 *
 * The editor context is the single shared reactive bag every track,
 * clip, and consumer component reads from. It holds:
 *   - viewport state (visible time range)
 *   - zoom state (pixelsPerTick, rowHeight)
 *   - layout dims (headerWidth, totalDuration)
 *   - tickDefs (for snap + ruler)
 *   - per-track reactive state (lazily created from createState)
 *
 * Library components inject this directly; consumer components can
 * useEditor() from outside to read viewport / zoom / etc.
 */

import { inject, provide, reactive, readonly, ref, computed, shallowRef } from 'vue';

export const EDITOR_CTX = Symbol('vtm:editor');

/**
 * @typedef {Object} EditorOptions
 * @property {number} duration
 * @property {number} pixelsPerTick
 * @property {number} rowHeight
 * @property {number} headerWidth
 * @property {number} timelineHeight
 * @property {import('../time.js').TickDef[]} tickDefs
 */

/**
 * @param {EditorOptions} opts
 */
export function provideEditor(opts) {
	const duration = ref(opts.duration);
	const pixelsPerTick = ref(opts.pixelsPerTick);
	const rowHeight = ref(opts.rowHeight);
	const headerWidth = ref(opts.headerWidth);
	const timelineHeight = ref(opts.timelineHeight);
	const tickDefs = shallowRef(opts.tickDefs ?? []);

	const scrollLeft = ref(0);
	const viewportWidthPx = ref(0);

	const viewportStart = computed(() => Math.floor(scrollLeft.value / pixelsPerTick.value));
	const viewportEnd = computed(() =>
		Math.ceil((scrollLeft.value + viewportWidthPx.value) / pixelsPerTick.value));

	const totalContentWidthPx = computed(() => duration.value * pixelsPerTick.value);

	function zoomXAt(factor, anchorPx) {
		const oldPpt = pixelsPerTick.value;
		const newPpt = clamp(oldPpt * factor, 1e-6, 1000);
		const anchorTime = (scrollLeft.value + anchorPx) / oldPpt;
		pixelsPerTick.value = newPpt;
		scrollLeft.value = Math.max(0, anchorTime * newPpt - anchorPx);
	}

	function zoomY(factor) {
		rowHeight.value = clamp(rowHeight.value * factor, 1, 200);
	}

	function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

	const trackStates = new Map();
	function getTrackState(trackId, def) {
		if (trackStates.has(trackId)) return trackStates.get(trackId);
		const factory = def && def.behavior && def.behavior.createState;
		const seed = factory ? factory() : {};
		const wrapped = reactive(seed);
		trackStates.set(trackId, wrapped);
		return wrapped;
	}
	function dropTrackState(trackId) {
		trackStates.delete(trackId);
	}

	const ctx = {
		duration, pixelsPerTick, rowHeight, headerWidth, timelineHeight,
		tickDefs, scrollLeft, viewportWidthPx,
		viewportStart, viewportEnd, totalContentWidthPx,
		getTrackState, dropTrackState,
		zoomXAt, zoomY,
	};

	provide(EDITOR_CTX, ctx);
	return ctx;
}

export function useEditor() {
	const ctx = inject(EDITOR_CTX, null);
	if (!ctx) {
		throw new Error('useEditor() called outside of <VueTrackMaster>.');
	}
	return ctx;
}

export function useViewport() {
	const ctx = useEditor();
	return {
		start: readonly(ctx.viewportStart),
		end: readonly(ctx.viewportEnd),
		pixelsPerTick: readonly(ctx.pixelsPerTick),
	};
}
