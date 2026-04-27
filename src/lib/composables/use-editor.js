/**
 * @file VueTrackMaster - editor context (provide/inject).
 *
 * The editor context is the single shared reactive bag every track,
 * clip, and consumer component reads from. It holds:
 *   - viewport state (visible time range)
 *   - zoom state (pixelsPerTick, rowHeight)
 *   - layout dims (headerWidth, totalDuration)
 *   - tickDefs (for snap + ruler)
 *
 * Mutation helpers are also returned (setZoom, setRowHeight, etc.).
 * Library components inject this directly; consumer components can
 * `useEditor()` from outside to read viewport / zoom / etc.
 */

import { inject, provide, readonly, ref, computed, shallowRef } from 'vue';

export const EDITOR_CTX = Symbol('vtm:editor');

/**
 * @typedef {Object} EditorOptions
 * @property {number} duration       Total content length in ticks.
 * @property {number} pixelsPerTick  Initial horizontal zoom.
 * @property {number} rowHeight      Initial vertical zoom (px per row unit).
 * @property {number} headerWidth    Px width of the sticky header column.
 * @property {number} timelineHeight Px height of the timeline ruler.
 * @property {import('../time.js').TickDef[]} tickDefs
 */

/**
 * Create the editor context. Called once by VueTrackMaster.
 * Returns the context AND provides it for descendants.
 * @param {EditorOptions} opts
 */
export function provideEditor(opts) {
	const duration = ref(opts.duration);
	const pixelsPerTick = ref(opts.pixelsPerTick);
	const rowHeight = ref(opts.rowHeight);
	const headerWidth = ref(opts.headerWidth);
	const timelineHeight = ref(opts.timelineHeight);
	const tickDefs = shallowRef(opts.tickDefs ?? []);

	// Viewport — driven by the scroll container's scrollLeft / clientWidth.
	// VueTrackMaster wires the scroll listener and pokes these refs.
	const scrollLeft = ref(0);
	const viewportWidthPx = ref(0);

	const viewportStart = computed(() => Math.floor(scrollLeft.value / pixelsPerTick.value));
	const viewportEnd = computed(() =>
		Math.ceil((scrollLeft.value + viewportWidthPx.value) / pixelsPerTick.value));

	const totalContentWidthPx = computed(() => duration.value * pixelsPerTick.value);

	/**
	 * Anchor-zoom horizontally: scale pixelsPerTick while keeping the time
	 * under `anchorPx` (relative to the scroll container's left edge) fixed.
	 * @param {number} factor      Multiplier (>1 = zoom in).
	 * @param {number} anchorPx    Mouse X relative to the scroll container.
	 */
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

	const ctx = {
		// state (refs - keep mutable internally, expose readonly to consumers later if needed)
		duration,
		pixelsPerTick,
		rowHeight,
		headerWidth,
		timelineHeight,
		tickDefs,
		scrollLeft,
		viewportWidthPx,

		// derived
		viewportStart,
		viewportEnd,
		totalContentWidthPx,

		// actions
		zoomXAt,
		zoomY,
	};

	provide(EDITOR_CTX, ctx);
	return ctx;
}

/**
 * Inject the editor context. Throws if used outside a VueTrackMaster.
 */
export function useEditor() {
	const ctx = inject(EDITOR_CTX, null);
	if (!ctx) {
		throw new Error('useEditor() called outside of <VueTrackMaster>.');
	}
	return ctx;
}

/**
 * Read-only viewport info. Useful for consumer components that need
 * to know the visible range without exposing zoom mutators.
 */
export function useViewport() {
	const ctx = useEditor();
	return {
		start: readonly(ctx.viewportStart),
		end: readonly(ctx.viewportEnd),
		pixelsPerTick: readonly(ctx.pixelsPerTick),
	};
}
