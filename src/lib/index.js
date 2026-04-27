/**
 * @file VueTrackMaster - public library entry.
 * Re-exports the components, composables, factories, and time helpers
 * a consumer needs. Consumer apps should import only from here, never
 * reach into internal paths.
 */

// Root + sub-components a consumer might want to compose with directly.
export { default as VueTrackMaster } from './components/VueTrackMaster.vue';
export { default as Track } from './components/Track.vue';
export { default as Clip } from './components/Clip.vue';
export { default as Timeline } from './components/Timeline.vue';
export { default as DefaultHeader } from './components/DefaultHeader.vue';
export { default as DefaultClipChrome } from './components/DefaultClipChrome.vue';

// Track definition factory.
export { defineTrack } from './define-track.js';

// Time + tick helpers.
export {
	DEFAULT_TICKS_PER_BEAT,
	DEFAULT_TICKS_PER_BAR,
	resolveTicks,
	snap,
	timeToPx,
	pxToTime,
	musicTicks,
	secondsTicks,
} from './time.js';

// Composables.
export { useEditor, useViewport } from './composables/use-editor.js';
export { filterVisible } from './composables/use-viewport.js';

// Render-side clip lifecycle hooks.
export {
	onClipMove,
	onClipScalePreview,
	onClipEditMode,
	onClipSpliced,
	onMarqueeIntersect,
} from './clip-hooks.js';

// Note: types.js is jsdoc-only and has nothing to export at runtime.
