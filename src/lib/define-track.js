/**
 * @file VueTrackMaster - defineTrack factory.
 */

/**
 * @typedef {import('./types.js').TrackDefinition} TrackDefinition
 * @typedef {import('./types.js').TrackMode} TrackMode
 */

const DEFAULTS = Object.freeze({
	mode: 'clips',
	layout: {
		rows: 8,
		minRows: 4,
		minHeightPx: 0,
		gutterTop: 0,
		gutterBottom: 0,
	},
	clips: {
		resizable: 'edge',
		scalable: 'none',
		sliceable: true,
		movable: true,
		overlap: 'allow',
		requiresEditMode: true,
	},
});

/**
 * @param {Partial<TrackDefinition>} def
 */
function validate(def) {
	if (!def || typeof def !== 'object') {
		throw new TypeError('defineTrack: definition must be an object');
	}
	if (typeof def.kind !== 'string' || def.kind.length === 0) {
		throw new TypeError('defineTrack: kind is required and must be a non-empty string');
	}
	if (!def.components || !def.components.header || !def.components.clipBody) {
		throw new TypeError(`defineTrack(${def.kind}): components.header and components.clipBody are required`);
	}
	const mode = def.mode ?? DEFAULTS.mode;
	if (mode !== 'raw' && mode !== 'clips' && mode !== 'mixed') {
		throw new TypeError(`defineTrack(${def.kind}): mode must be raw / clips / mixed`);
	}
	if (def.layout && def.layout.rows != null && def.layout.rows <= 0) {
		throw new TypeError(`defineTrack(${def.kind}): layout.rows must be > 0`);
	}
	if (def.layout && def.layout.minRows != null && def.layout.rows != null
		&& def.layout.minRows > def.layout.rows) {
		console.warn(
			`defineTrack(${def.kind}): layout.minRows (${def.layout.minRows}) > layout.rows (${def.layout.rows}); track will always render at the floor.`,
		);
	}
	if (def.clips && def.clips.scalable === 'edge' && !(def.behavior && def.behavior.onClipRescale)) {
		console.warn(
			`defineTrack(${def.kind}): clips.scalable is 'edge' but no behavior.onClipRescale handler.`,
		);
	}
	if (def.clips && def.clips.sliceable !== false && mode !== 'raw'
		&& !(def.behavior && def.behavior.onClipSplice)) {
		console.warn(
			`defineTrack(${def.kind}): clips are sliceable but no behavior.onClipSplice handler.`,
		);
	}
}

/**
 * @param {Partial<TrackDefinition>} def
 * @returns {TrackDefinition}
 */
function withDefaults(def) {
	const layout = Object.assign({}, DEFAULTS.layout, def.layout || {});
	const clips = Object.assign({}, DEFAULTS.clips, def.clips || {});
	return /** @type {TrackDefinition} */ ({
		kind: def.kind,
		mode: def.mode || DEFAULTS.mode,
		components: def.components,
		layout,
		clips,
		data: def.data,
		behavior: def.behavior,
	});
}

/**
 * @param {Partial<TrackDefinition>} def
 * @returns {TrackDefinition}
 */
export function defineTrack(def) {
	validate(def);
	return Object.freeze(withDefaults(def));
}
