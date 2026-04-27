/**
 * @file VueTrackMaster - public library entry.
 */

export { default as VueTrackMaster } from './components/VueTrackMaster.vue';
export { default as Track } from './components/Track.vue';
export { default as Clip } from './components/Clip.vue';
export { default as Timeline } from './components/Timeline.vue';
export { default as DefaultHeader } from './components/DefaultHeader.vue';
export { default as DefaultClipChrome } from './components/DefaultClipChrome.vue';
export { default as DefaultTrackBackground } from './components/DefaultTrackBackground.vue';

export { defineTrack } from './define-track.js';

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

export { useEditor, useViewport } from './composables/use-editor.js';
export { filterVisible } from './composables/use-viewport.js';

export {
	onClipMove,
	onClipScalePreview,
	onClipEditMode,
	onClipSpliced,
	onMarqueeIntersect,
} from './clip-hooks.js';
