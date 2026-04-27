/**
 * @file VueTrackMaster - time and tick-definition primitives.
 *
 * Time is a single integer scalar (VTMTime). Consumers layer named
 * "tick definitions" on top to describe musical bars/beats, seconds,
 * frames, samples, or whatever their domain calls for. The library
 * never assumes what a tick means - it just knows tick math.
 *
 * Why integers: equality, snapping, and clip-boundary math have to be
 * exact. Floating-point time accumulates error after thousands of edits
 * and quantize passes. Integer ticks dodge that whole class of bug.
 */

/**
 * Integer tick count. May be negative (tracks can extend before t=0).
 * @typedef {number} VTMTime
 */

export const DEFAULT_TICKS_PER_BEAT = 960;
export const DEFAULT_TICKS_PER_BAR = 3840;

/**
 * @typedef {Object} TickDef
 * @property {string} name
 * @property {number | ((time: VTMTime) => number)} ticks
 * @property {((index: number, time: VTMTime) => string) | null} [label]
 * @property {number} [timelineHeight]    Ruler tick height (0..1).
 * @property {number} [gridLine]          Track-grid vertical line height (0..1).
 * @property {boolean} [gridDot]          Place a dot on the track grid at this tick.
 * @property {string} [gridLineColor]     CSS color for the grid line.
 * @property {boolean} [snapTarget]
 * @property {string} [cssClass]
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
 * @param {VTMTime} time
 * @param {number} pixelsPerTick
 * @returns {number}
 */
export function timeToPx(time, pixelsPerTick) {
	return time * pixelsPerTick;
}

/**
 * @param {number} px
 * @param {number} pixelsPerTick
 * @returns {number}
 */
export function pxToTime(px, pixelsPerTick) {
	return px / pixelsPerTick;
}

/**
 * Default music tick set: bar, beat, sixteenth.
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
			gridLine: 1.0,
			gridLineColor: 'var(--vtm-grid-bar, #555)',
			cssClass: 'vtm-tick-bar',
		},
		{
			name: 'beat',
			ticks: ticksPerBeat,
			label: null,
			timelineHeight: 0.5,
			gridLine: 1.0,
			gridLineColor: 'var(--vtm-grid-beat, #3a3a3a)',
			cssClass: 'vtm-tick-beat',
		},
		{
			name: 'sixteenth',
			ticks: ticksPerBeat / 4,
			label: null,
			timelineHeight: 0.25,
			gridLine: 0,
			gridDot: true,
			cssClass: 'vtm-tick-16th',
		},
	];
}

/**
 * Wallclock tick set.
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
			gridLine: 1.0,
		},
		{
			name: 'second',
			ticks: tps,
			label: (i) => (i % 5 === 0 ? `${i}s` : ''),
			timelineHeight: 0.4,
			gridLine: 0.4,
		},
	];
}
