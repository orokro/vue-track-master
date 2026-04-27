/**
 * @file VueTrackMaster — time and tick-definition primitives.
 *
 * Time is a single integer scalar (`VTMTime`). Consumers layer named
 * "tick definitions" on top to describe musical bars/beats, seconds,
 * frames, samples, or whatever their domain calls for. The library
 * never assumes what a tick means — it just knows tick math.
 *
 * Why integers: equality, snapping, and clip-boundary math have to be
 * exact. Floating-point time accumulates error after thousands of edits
 * and quantize passes. Integer ticks dodge that whole class of bug.
 */

/**
 * Integer tick count. May be negative (tracks can extend before t=0).
 * Treat as opaque — pass through helpers, don't do raw arithmetic on
 * VTMTime values across mixed unit assumptions.
 * @typedef {number} VTMTime
 */

/**
 * Default base resolution. Pick something high and divisible.
 * 3840 = 2^7 * 30 — divides cleanly into bars/beats/triplets and into
 * 24/25/30/60 fps frame grids. Override per-project if you need more.
 */
export const DEFAULT_TICKS_PER_BEAT = 960;
export const DEFAULT_TICKS_PER_BAR = 3840;

/**
 * @typedef {Object} TickDef
 * @property {string} name
 *   Stable identifier ('bar', 'beat', 'second', 'frame'). Used as the
 *   key for snap targets and ruler styling.
 * @property {number | ((time: VTMTime) => number)} ticks
 *   Ticks per unit. A function lets variable time signatures or
 *   variable frame rates report a different size at different points.
 *   For v1, prefer a constant.
 * @property {((index: number, time: VTMTime) => string) | null} [label]
 *   Returns the label drawn at this tick on the ruler. `null` (or
 *   omitted) = no text label, just the tick mark. `index` is the nth
 *   occurrence of this unit from t=0.
 * @property {number} [timelineHeight]
 *   Tick mark height as a fraction of the ruler's drawable area
 *   (0..1). Omit or 0 to suppress the tick mark itself (snap-only).
 * @property {boolean} [snapTarget]
 *   Whether this unit is selectable as a snap grid. Default true.
 * @property {string} [cssClass]
 *   Optional class applied to the tick element so consumers can theme
 *   bars vs. beats vs. subdivisions.
 */

/**
 * Resolve `ticks` for a TickDef at a given time.
 * @param {TickDef} def
 * @param {VTMTime} time
 * @returns {number}
 */
export function resolveTicks(def, time) {
	return typeof def.ticks === 'function' ? def.ticks(time) : def.ticks;
}

/**
 * Snap a time to the nearest multiple of a tick definition.
 * @param {VTMTime} time
 * @param {TickDef} def
 * @param {'nearest' | 'floor' | 'ceil'} [mode]
 * @returns {VTMTime}
 */
export function snap(time, def, mode = 'nearest') {
	const t = resolveTicks(def, time);
	if (t <= 0) return time;
	const q = time / t;
	const n = mode === 'floor' ? Math.floor(q)
		: mode === 'ceil' ? Math.ceil(q)
		: Math.round(q);
	return n * t;
}

/**
 * Convert time to pixels given the current horizontal zoom.
 * @param {VTMTime} time
 * @param {number} pixelsPerTick
 * @returns {number}
 */
export function timeToPx(time, pixelsPerTick) {
	return time * pixelsPerTick;
}

/**
 * Convert pixels to time. Returns a non-integer; round/snap before
 * storing.
 * @param {number} px
 * @param {number} pixelsPerTick
 * @returns {number}
 */
export function pxToTime(px, pixelsPerTick) {
	return px / pixelsPerTick;
}

/**
 * Build a default music tick set at the given base resolution.
 * Useful for piano-roll/curve setups where the consumer doesn't want
 * to hand-author the tick array.
 * @param {Object} [opts]
 * @param {number} [opts.ticksPerBar]
 * @param {number} [opts.ticksPerBeat]
 * @returns {TickDef[]}
 */
export function musicTicks(opts = {}) {
	const ticksPerBar = opts.ticksPerBar ?? DEFAULT_TICKS_PER_BAR;
	const ticksPerBeat = opts.ticksPerBeat ?? DEFAULT_TICKS_PER_BEAT;
	return [
		{
			name: 'bar',
			ticks: ticksPerBar,
			label: (i) => String(i + 1),
			timelineHeight: 1.0,
			cssClass: 'vtm-tick-bar',
		},
		{
			name: 'beat',
			ticks: ticksPerBeat,
			label: null,
			timelineHeight: 0.5,
			cssClass: 'vtm-tick-beat',
		},
		{
			name: 'sixteenth',
			ticks: ticksPerBeat / 4,
			label: null,
			timelineHeight: 0.25,
			cssClass: 'vtm-tick-16th',
		},
	];
}

/**
 * Build a wallclock tick set. `ticksPerSecond` lets you keep integer
 * time even for wave/video projects (e.g. 48000 for sample-accurate).
 * @param {Object} [opts]
 * @param {number} [opts.ticksPerSecond]
 * @returns {TickDef[]}
 */
export function secondsTicks(opts = {}) {
	const tps = opts.ticksPerSecond ?? 1000;
	return [
		{
			name: 'minute',
			ticks: tps * 60,
			label: (i) => `${i}:00`,
			timelineHeight: 1.0,
		},
		{
			name: 'second',
			ticks: tps,
			label: (i) => (i % 5 === 0 ? `${i}s` : ''),
			timelineHeight: 0.4,
		},
	];
}
