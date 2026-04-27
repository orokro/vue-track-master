/**
 * @file VueTrackMaster - shared jsdoc typedefs.
 *
 * No runtime exports. This file exists so other modules and consumer
 * components can `@typedef {import('@/lib/types').ClipBodyProps} ...`
 * without circular-importing the whole library.
 *
 * The contracts here are the public API surface. Renaming or
 * reshaping anything in this file is a breaking change.
 */

/* ----- Geometry & viewport ----- */

/**
 * @typedef {Object} ViewportRange
 * @property {import('./time.js').VTMTime} start
 * @property {import('./time.js').VTMTime} end
 */

/**
 * @typedef {Object} TimeRect
 * @property {import('./time.js').VTMTime} startTime
 * @property {import('./time.js').VTMTime} endTime
 * @property {number} startRow
 * @property {number} endRow
 */

/**
 * @typedef {Object} PixelRect
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/* ----- Clip body prop contract ----- */

/**
 * Props the library passes to a clip-body component. Raw-data tracks
 * receive the same shape with `clipId === null` and the start/end
 * pinned to the track extent.
 *
 * No `contentScale` prop. Library always presents clips as 1:1 with
 * their stored data; horizontal scaling is a consumer operation
 * triggered by `behavior.onClipRescale` on the track definition.
 *
 * @typedef {Object} ClipBodyProps
 * @property {string | null} clipId
 * @property {string} trackId
 * @property {import('./time.js').VTMTime} startTime
 * @property {import('./time.js').VTMTime} endTime
 * @property {import('./time.js').VTMTime} startVisibleTime
 * @property {import('./time.js').VTMTime} endVisibleTime
 * @property {boolean} fullyVisible
 * @property {number} pixelsPerTick
 * @property {number} pixelsPerRow      Effective row height = global rowHeight * track stretch.
 * @property {boolean} isEditMode
 * @property {boolean} isSelected
 * @property {ClipBodyApi} api
 * @property {any} state                Per-track reactive state (result of behavior.createState).
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
 * @property {boolean} [additive]
 * @property {boolean} [toggle]
 */

/**
 * @typedef {Object} MarqueeHandle
 * @property {(cb: (rect: MarqueeRect) => void) => void} onUpdate
 * @property {(cb: (rect: MarqueeRect) => void) => void} onCommit
 * @property {() => void} cancel
 */

/**
 * @typedef {Object} MarqueeRect
 * @property {PixelRect} pixel
 * @property {TimeRect}  time
 */

/**
 * @typedef {Object} SelectableRef
 * @property {string} kind
 * @property {string} id
 */

/* ----- Track header ----- */

/**
 * @typedef {Object} TrackHeaderProps
 * @property {string} trackId
 * @property {boolean} collapsed
 * @property {boolean} enabled
 * @property {number} pixelHeight
 * @property {TrackHeaderApi} api
 * @property {string} [displayName]
 * @property {any} state                Per-track reactive state.
 */

/**
 * @typedef {Object} TrackHeaderApi
 * @property {() => void} toggleCollapsed
 * @property {(v: boolean) => void} setEnabled
 * @property {(rows: number) => void} setRows
 * @property {(stretch: number) => void} setStretch
 */

/* ----- Track background ----- */

/**
 * @typedef {Object} TrackBackgroundProps
 * @property {string} trackId
 * @property {number} pixelHeight
 * @property {any} state
 */

/* ----- Track definition ----- */

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
 * @property {string} kind
 * @property {TrackMode} mode
 * @property {Object} components
 * @property {import('vue').Component} components.header
 * @property {import('vue').Component} components.clipBody
 * @property {import('vue').Component} [components.clipChrome]
 * @property {import('vue').Component} [components.background]
 *   Optional override for the track's grid renderer. Defaults to the
 *   library's DefaultTrackBackground (dot + line grid driven by tickDefs).
 * @property {Object} [layout]
 * @property {number} [layout.rows]
 * @property {number} [layout.minRows]
 * @property {number} [layout.minHeightPx]
 *   Hard pixel floor independent of rows/rowHeight. Use when a header
 *   has a controls block that must fit regardless of row count.
 * @property {number} [layout.gutterTop]
 * @property {number} [layout.gutterBottom]
 * @property {Object} [clips]
 * @property {EdgeBehavior} [clips.resizable]
 * @property {EdgeBehavior} [clips.scalable]
 * @property {boolean} [clips.sliceable]
 * @property {boolean} [clips.movable]
 * @property {OverlapPolicy | OverlapResolver} [clips.overlap]
 * @property {boolean} [clips.requiresEditMode]
 * @property {Object} [data]
 * @property {(state: any) => Iterable<any>} [data.items]
 * @property {(item: any) => [import('./time.js').VTMTime, import('./time.js').VTMTime]} [data.range]
 * @property {Object} [behavior]
 * @property {() => any} [behavior.createState]
 * @property {Record<string, (state: any, payload: any) => void>} [behavior.commands]
 * @property {ClipSpliceHandler} [behavior.onClipSplice]
 * @property {ClipRescaleHandler} [behavior.onClipRescale]
 * @property {ClipDeleteHandler} [behavior.onClipDelete]
 * @property {ClipDuplicateHandler} [behavior.onClipDuplicate]
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

/* ----- Editor-level events ----- */

/**
 * @typedef {Object} EditorEvents
 * @property {(e: any) => void} clip_moved
 * @property {(e: any) => void} clip_created
 * @property {(e: any) => void} clip_deleted
 * @property {(e: any) => void} clip_spliced
 * @property {(e: any) => void} clip_rescaled
 * @property {(e: any) => void} clip_editMode
 * @property {(e: any) => void} selection_changed
 * @property {(e: any) => void} viewport_changed
 */

export {};
