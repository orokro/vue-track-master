/**
 * @file VueTrackMaster — render-side clip lifecycle composables.
 *
 * These hooks are SUGAR for components that want to react visually to
 * clip events (flash on move, animate on enter-edit, scrub a preview
 * during scale gesture). They are NOT the path for data integrity.
 *
 * Data integrity lives on the track definition in `behavior.onClip*`
 * — see `define-track.js`. Those callbacks fire regardless of whether
 * the clip body is currently mounted, which matters when a clip is
 * culled offscreen mid-edit.
 *
 * The composables below only fire while the body is mounted. Treat
 * them as best-effort observers, not as the source of truth.
 */

import { onBeforeUnmount, inject } from 'vue';

/**
 * Injection key the editor uses to expose its per-clip event bus to
 * the body component tree. Bus shape: { on(name, fn) -> off }.
 */
export const CLIP_BUS_INJECTION = Symbol('vtm:clip-bus');

/**
 * @template T
 * @param {string} eventName
 * @param {(payload: T) => void} fn
 */
function bind(eventName, fn) {
	const bus = inject(CLIP_BUS_INJECTION, null);
	if (!bus) {
		// Helpful in dev — silent in prod would mean broken hooks no
		// one notices. Fail loud.
		throw new Error(
			`vue-track-master: clip-hooks called outside of a clip body component (no clip bus injected). Hook: ${eventName}`,
		);
	}
	const off = bus.on(eventName, fn);
	onBeforeUnmount(off);
}

/**
 * Fired when this clip's start moves on the timeline.
 * Use for animations, preview scrubbing, audio reschedule pings —
 * NOT for moving stored data. Notes/data stored in clip-local time
 * follow the clip automatically.
 * @param {(e: { delta: import('./time.js').VTMTime, oldStart: import('./time.js').VTMTime, newStart: import('./time.js').VTMTime }) => void} fn
 */
export function onClipMove(fn) {
	bind('move', fn);
}

/**
 * Fired during a scale-handle drag while the gesture is in flight.
 * Use to render a live preview. The committed rescale fires through
 * `behavior.onClipRescale` on the track definition.
 * @param {(e: { ratio: number, dragging: boolean }) => void} fn
 */
export function onClipScalePreview(fn) {
	bind('scalePreview', fn);
}

/**
 * Fired when this clip enters or exits edit mode.
 * @param {(e: { mode: 'enter' | 'exit' }) => void} fn
 */
export function onClipEditMode(fn) {
	bind('editMode', fn);
}

/**
 * Fired when a splice gesture commits. Use to animate the visual
 * split. Data partitioning happens in `behavior.onClipSplice`.
 * @param {(e: { at: import('./time.js').VTMTime, side: 'left' | 'right' }) => void} fn
 */
export function onClipSpliced(fn) {
	bind('spliced', fn);
}

/**
 * Fired when the user starts and ends a marquee selection that
 * intersects this clip. Useful when the consumer's clip-body wants
 * to participate in selection (highlight items inside the box).
 * Most consumers should call `props.api.startMarquee()` instead;
 * this hook is for the case where the editor initiated it elsewhere.
 * @param {(e: { rect: import('./types.js').MarqueeRect, phase: 'start' | 'update' | 'end' }) => void} fn
 */
export function onMarqueeIntersect(fn) {
	bind('marqueeIntersect', fn);
}
