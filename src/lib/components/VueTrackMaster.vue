<!--
	VueTrackMaster.vue
	------------------
	Root component. Owns the editor context (provides it via inject),
	the scroll/zoom state, and the overall layout: a sticky timeline
	row on top, then a vertically scrolling list of tracks. Each track
	is a CSS-grid row with a sticky-left header column and a body
	column that scrolls with the shared horizontal scroll.

	Wheel mapping (v0):
	  - plain wheel        -> vertical scroll (native)
	  - shift + wheel      -> horizontal scroll
	  - ctrl  + wheel      -> horizontal zoom (anchored at cursor)
	  - alt   + wheel      -> vertical zoom (rowHeight)
	These are the defaults; overridable later via props.
-->
<script setup>

import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { provideEditor } from '../composables/use-editor.js';
import { musicTicks } from '../time.js';
import Timeline from './Timeline.vue';
import Track from './Track.vue';

const props = defineProps({
	tracks:        { type: Array,  required: true },
	clipsByTrack:  { type: Object, default: () => ({}) },
	duration:      { type: Number, required: true },
	tickDefs:      { type: Array,  default: () => musicTicks() },
	pixelsPerTick: { type: Number, default: 0.05 },
	rowHeight:     { type: Number, default: 14 },
	headerWidth:   { type: Number, default: 200 },
	timelineHeight:{ type: Number, default: 28 },
});

const editor = provideEditor({
	duration: props.duration,
	pixelsPerTick: props.pixelsPerTick,
	rowHeight: props.rowHeight,
	headerWidth: props.headerWidth,
	timelineHeight: props.timelineHeight,
	tickDefs: props.tickDefs,
});

// Keep editor state in sync when consumer-controlled props change.
watch(() => props.duration,       (v) => { editor.duration.value = v; });
watch(() => props.pixelsPerTick,  (v) => { editor.pixelsPerTick.value = v; });
watch(() => props.rowHeight,      (v) => { editor.rowHeight.value = v; });
watch(() => props.headerWidth,    (v) => { editor.headerWidth.value = v; });
watch(() => props.timelineHeight, (v) => { editor.timelineHeight.value = v; });
watch(() => props.tickDefs,       (v) => { editor.tickDefs.value = v; });

const scrollEl = ref(null);

let rafPending = false;
function syncViewportFromScroll() {
	if (!scrollEl.value) return;
	if (rafPending) return;
	rafPending = true;
	requestAnimationFrame(() => {
		rafPending = false;
		const el = scrollEl.value;
		if (!el) return;
		editor.scrollLeft.value = el.scrollLeft;
		editor.viewportWidthPx.value = el.clientWidth - editor.headerWidth.value;
	});
}

function onScroll() { syncViewportFromScroll(); }

function onWheel(e) {
	if (!scrollEl.value) return;
	if (e.ctrlKey) {
		e.preventDefault();
		const rect = scrollEl.value.getBoundingClientRect();
		const anchor = e.clientX - rect.left - editor.headerWidth.value;
		const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
		editor.zoomXAt(factor, anchor);
		// scrollLeft was set inside zoomXAt; reflect onto the DOM element.
		scrollEl.value.scrollLeft = editor.scrollLeft.value;
	} else if (e.altKey) {
		e.preventDefault();
		const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
		editor.zoomY(factor);
	} else if (e.shiftKey) {
		e.preventDefault();
		scrollEl.value.scrollLeft += e.deltaY;
	}
	// plain wheel -> default vertical scroll
}

let resizeObs = null;
onMounted(() => {
	syncViewportFromScroll();
	resizeObs = new ResizeObserver(syncViewportFromScroll);
	if (scrollEl.value) resizeObs.observe(scrollEl.value);
});
onBeforeUnmount(() => {
	if (resizeObs) resizeObs.disconnect();
});

const gridTemplateColumns = computed(() =>
	`${editor.headerWidth.value}px ${editor.totalContentWidthPx.value}px`);

</script>
<template>
	<div
		ref="scrollEl"
		class="vtm-root"
		@scroll.passive="onScroll"
		@wheel="onWheel"
	>
		<div
			class="vtm-grid"
			:style="{ gridTemplateColumns }"
		>
			<div class="vtm-corner" :style="{
				width: editor.headerWidth.value + 'px',
				height: editor.timelineHeight.value + 'px',
			}"></div>
			<Timeline />
			<Track
				v-for="track in tracks"
				:key="track.id"
				:track="track"
				:clips="clipsByTrack[track.id] || []"
			/>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.vtm-root {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: auto;
	background: var(--vtm-bg, #1a1a1a);
	color: var(--vtm-fg, #ddd);
	contain: strict;
}

.vtm-grid {
	display: grid;
	grid-auto-rows: min-content;
	min-height: 100%;
}

.vtm-corner {
	position: sticky;
	top: 0;
	left: 0;
	z-index: 3;
	background: var(--vtm-header-bg, #2a2a2a);
	border-right: 1px solid var(--vtm-border, #444);
	border-bottom: 1px solid var(--vtm-border, #444);
}

</style>
