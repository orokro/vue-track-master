/**
 * @file VueTrackMaster — shared jsdoc typedefs.
 *
 * No runtime exports. This file exists so other modules and consumer
 * components can `@typedef {import('@/lib/types').ClipBodyProps} ...`
 * without circular-importing the whole library.
 *
 * The contracts here are the public API surface. Renaming or
 * reshaping anything in this file is a breaking change.
 */

/* ------------------------------------------------------------------ *
 * Geometry & viewport                                                *
 * ------------------------------------------------------------------ */

/**
 * @typedef {Object} ViewportRange
 * @property {import('./time.js').VTMTime} start - Inclusive.
 * @property {import('./time.js').VTMTime} end   - Exclusive.
 */

/**
 * @typedef {Object} TimeRect
 * @property {import('./time.js').VTMTime} startTime
 * @property {import('./time.js').VTMTime} endTime
 * @property {number} startRow - Optional row index, NaN if track has no rows.
 * @property {number} endRow
 */

/**
 * @typedef {Object} PixelRect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/* ------------------------------------------------------------------ *
 * Clip body — the prop contract every consumer-supplied body sees    *
 * ------------------------------------------------------------------ */

/**
 * Props the library passes to a clip-body component. Raw-data tracks
 * receive the same shape with `clipId === null` and the start/end
 * pinned to the track extent.
 *
 * Note: there is intentionally no `contentScale` prop. Library always
 * presents clips as 1:1 with their stored data; horizontal scaling is
 * a *consumer* operation triggered by `behavior.onClipRescale` on the
 * track definition, where the consumer mutates their own data however
 * they want (stretch note positions, time-stretch audio, pitch-shift,
 * whatever). Library only renders the chrome that drives the gesture.
 *
 * @typedef {Object} ClipBodyProps
 *
 * @property {string | null} clipId
 *   Unique id, or null when this body is the implicit raw-track body.
 *
 * @property {string} trackId
 *
 * @property {import('./time.js').VTMTime} startTime
 *   Absolute start of the clip on the timeline. Notes/data inside the
 *   clip are stored in clip-local time; resolve to absolute via
 *   `startTime + localTime`. For raw bodies, the track's min extent.
 *
 * @property {import('./time.js').VTMTime} endTime
 *   Absolute end of the clip. For raw bodies, the track's max extent.
 *
 * @property {import('./time.js').VTMTime} startVisibleTime
 *   max(startTime, viewport.start). Painters that only care about
 *   what's on screen should read this, not startTime.
 *
 * @property {import('./time.js').VTMTime} endVisibleTime
 *   min(endTime, viewport.end).
 *
 * @property {boolean} fullyVisible
 *   True when the entire clip is on screen.
 *
 * @property {number} pixelsPerTick
 *   Current horizontal zoom.
 *
 * @property {number} pixelsPerRow
 *   Effective row height in pixels = global rowHeight * track stretch.
 *   Universal — even continuous tracks (curves, waves) get this; what
 *   a "row" means semantically is up to the body component.
 *
 * @property {boolean} isEditMode
 *   True for raw bodies (always editable) and for clips the user has
 *   tabbed into.
 *
 * @property {boolean} isSelected
 *
 * @property {ClipBodyApi} api
 */

/**
 * @typedef {Object} ClipBodyApi
 * @property {(time: import('./time.js').VTMTime) => number} timeToLocalPx
 * @property {(px: number) => import('./time.js').VTMTime} localPxToTime
 * @property {(time: import('./time.js').VTMTime) => import('./time.js').VTMTime} snap
 * @property {(opts?: MarqueeOpts) => MarqueeHandle} startMarquee
 * @property {(items: SelectableRef[]) => void} setSelection
 * @property {() => void} requestExitEditMode
 */

/**
 * @typedef {Object} MarqueeOpts
 * @property {boolean} [additive] - true = shift-held, add to selection.
 * @property {boolean} [toggle]   - true = ctrl-held, toggle membership.
 */

/**
 * @typedef {Object} MarqueeHandle
 * @property {(cb: (rect: MarqueeRect) => void) => void} onUpdate
 * @property {(cb: (rect: MarqueeRect) => void) => void} onCommit
 * @property {() => void} cancel
 */

/**
 * @typedef {Object} MarqueeRect
 * @property {PixelRect} pixel - Relative to the clip body.
 * @property {TimeRect}  time  - Time + row range.
 */

/**
 * @typedef {Object} SelectableRef
 * @property {string} kind  - Consumer-defined ('note', 'handle', etc.)
 * @property {string} id
 */

/* ------------------------------------------------------------------ *
 * Track header                                                       *
 * ------------------------------------------------------------------ */

/**
 * @typedef {Object} TrackHeaderProps
 * @property {string} trackId
 * @property {boolean} collapsed
 * @property {boolean} enabled
 * @property {number} pixelHeight
 * @property {TrackHeaderApi} api
 */

/**
 * @typedef {Object} TrackHeaderApi
 * @property {() => void} toggleCollapsed
 * @property {(v: boolean) => void} setEnabled
 * @property {(rows: number) => void} setRows
 *   Change the data-driven row count (piano roll octaves, data fields).
 * @property {(stretch: number) => void} setStretch
 *   Per-track vertical multiplier. 1.0 = no stretch.
 */

/* ------------------------------------------------------------------ *
 * Track definition                                                   *
 * ------------------------------------------------------------------ */

/**
 * @typedef {'raw' | 'clips' | 'mixed'} TrackMode
 */

/**
 * @typedef {'edge' | 'none'} EdgeBehavior
 */

/**
 * @typedef {'allow' | 'push' | 'truncate' | 'replace'} OverlapPolicy
 */

/**
 * @typedef {Object} TrackDefinition
 *
 * @property {string} kind
 *   Stable identifier for this track type ('curve', 'midi', 'wave').
 *
 * @property {TrackMode} mode
 *
 * @property {Object} components
 * @property {import('vue').Component} components.header
 * @property {import('vue').Component} components.clipBody
 * @property {import('vue').Component} [components.clipChrome]
 *
 * @property {Object} [layout]
 * @property {number} [layout.rows]
 *   Track height expressed in row-units. Editor sets a global rowHeight
 *   (px); track final height is rows * rowHeight * stretch, floored by
 *   minRows * rowHeight. Fractions allowed. For row-semantic tracks
 *   (piano roll, data tables) `rows` is data-driven; for continuous
 *   tracks (curve, wave) it's a height preference (e.g. 8).
 * @property {number} [layout.minRows]
 *   Floor in row-units.
 * @property {number} [layout.gutterTop]
 * @property {number} [layout.gutterBottom]
 *
 * @property {Object} [clips]
 * @property {EdgeBehavior} [clips.resizable]
 * @property {EdgeBehavior} [clips.scalable]
 * @property {boolean} [clips.sliceable]
 * @property {boolean} [clips.movable]
 * @property {OverlapPolicy | OverlapResolver} [clips.overlap]
 * @property {boolean} [clips.requiresEditMode]
 *
 * @property {Object} [data]
 * @property {(state: any) => Iterable<any>} [data.items]
 * @property {(item: any) => [import('./time.js').VTMTime, import('./time.js').VTMTime]} [data.range]
 *
 * @property {Object} [behavior]
 * @property {() => any} [behavior.createState]
 *   Factory for per-instance state. Return value is wrapped with
 *   reactive() and passed to header/body components and to every
 *   behavior callback as `state`. Typical shape: a Map keyed by
 *   clipId, with values holding clip contents in clip-local time.
 * @property {Record<string, (state: any, payload: any) => void>} [behavior.commands]
 * @property {ClipSpliceHandler} [behavior.onClipSplice]
 *   Library calls this when the user splices a clip. Consumer must
 *   partition their data; right-half items have local times shifted
 *   by -at. rightClipId is already created in library metadata.
 * @property {ClipRescaleHandler} [behavior.onClipRescale]
 *   Fires when the user drags a scale handle. Consumer decides what
 *   stretch means for their data. Library does not record `ratio`;
 *   the next render shows a 1:1 clip with the consumer's new data.
 * @property {ClipDeleteHandler} [behavior.onClipDelete]
 * @property {ClipDuplicateHandler} [behavior.onClipDuplicate]
 *
 * Note: no onClipMove on the track definition. Move is metadata-only;
 * clip contents in clip-local time follow automatically. For render
 * side effects use the onClipMove composable from clip-hooks.js, or
 * subscribe to the editor's clip:moved event for playback sync.
 */

/**
 * @callback ClipSpliceHandler
 * @param {Object} args
 * @param {string} args.clipId
 * @param {string} args.leftClipId
 * @param {string} args.rightClipId
 * @param {import('./time.js').VTMTime} args.at
 * @param {any} args.state
 */

/**
 * @callback ClipRescaleHandler
 * @param {Object} args
 * @param {string} args.clipId
 * @param {number} args.ratio
 * @param {import('./time.js').VTMTime} args.oldDuration
 * @param {import('./time.js').VTMTime} args.newDuration
 * @param {any} args.state
 */

/**
 * @callback ClipDeleteHandler
 * @param {Object} args
 * @param {string} args.clipId
 * @param {any} args.state
 */

/**
 * @callback ClipDuplicateHandler
 * @param {Object} args
 * @param {string} args.sourceClipId
 * @param {string} args.newClipId
 * @param {any} args.state
 */

/**
 * @callback OverlapResolver
 * @param {{ id: string, start: import('./time.js').VTMTime, end: import('./time.js').VTMTime }} moving
 * @param {Array<{ id: string, start: import('./time.js').VTMTime, end: import('./time.js').VTMTime }>} existing
 * @returns {OverlapAction[]}
 */

/**
 * @typedef {Object} OverlapAction
 * @property {'truncate' | 'split' | 'remove' | 'shift'} op
 * @property {string} targetId
 * @property {import('./time.js').VTMTime} [at]
 * @property {import('./time.js').VTMTime} [delta]
 */

/* ------------------------------------------------------------------ *
 * Editor-level events — fire regardless of mount state.              *
 * Subscribe via editor.on('clip:moved', fn).                         *
 * ------------------------------------------------------------------ */

/**
 * @typedef {Object} EditorEvents
 * @property {(e: { trackId: string, clipId: string, oldStart: import('./time.js').VTMTime, newStart: import('./time.js').VTMTime }) => void} clip:moved
 * @property {(e: { trackId: string, clipId: string }) => void} clip:created
 * @property {(e: { trackId: string, clipId: string }) => void} clip:deleted
 * @property {(e: { trackId: string, leftClipId: string, rightClipId: string, at: import('./time.js').VTMTime }) => void} clip:spliced
 * @property {(e: { trackId: string, clipId: string, oldDuration: import('./time.js').VTMTime, newDuration: import('./time.js').VTMTime }) => void} clip:rescaled
 * @property {(e: { trackId: string, clipId: string | null, mode: 'enter' | 'exit' }) => void} clip:editMode
 * @property {(e: { selection: SelectableRef[] }) => void} selection:changed
 * @property {(e: { viewport: ViewportRange }) => void} viewport:changed
 */

export {};
