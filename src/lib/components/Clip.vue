<!--
	Clip.vue
	--------
	Wraps a single clip on a track. Computes its position/width from
	the clip metadata and current zoom; mounts the user's clip body
	component with the full ClipBodyProps contract; renders the chrome.

	v0 NOTE: gesture wiring (drag-move, drag-resize) is stubbed - the
	chrome emits intents which currently no-op. Hooking them up to the
	editor command bus is a follow-up pass.
-->
<script setup>

import { computed } from 'vue';
import { useEditor } from '../composables/use-editor.js';
import DefaultClipChrome from './DefaultClipChrome.vue';

const props = defineProps({
	clip:     { type: Object, required: true },   // { id, start, end }
	trackId:  { type: String, required: true },
	trackDef: { type: Object, required: true },   // TrackDefinition
	pixelHeight: { type: Number, required: true },
	rawBody:  { type: Boolean, default: false },  // implicit raw body (no chrome)
});

const editor = useEditor();

const startTime = computed(() => props.clip.start);
const endTime   = computed(() => props.clip.end);

const startPx = computed(() => startTime.value * editor.pixelsPerTick.value);
const widthPx = computed(() =>
	(endTime.value - startTime.value) * editor.pixelsPerTick.value);

const startVisibleTime = computed(() => Math.max(startTime.value, editor.viewportStart.value));
const endVisibleTime   = computed(() => Math.min(endTime.value, editor.viewportEnd.value));
const fullyVisible     = computed(() =>
	startVisibleTime.value === startTime.value && endVisibleTime.value === endTime.value);

const isOnScreen = computed(() => endVisibleTime.value > startVisibleTime.value);

const bodyApi = {
	timeToLocalPx: (t) => (t - startTime.value) * editor.pixelsPerTick.value,
	localPxToTime: (px) => startTime.value + px / editor.pixelsPerTick.value,
	snap: (t) => t,                                // TODO snap config
	startMarquee: () => ({ onUpdate() {}, onCommit() {}, cancel() {} }),
	setSelection: () => {},                        // TODO selection model
	requestExitEditMode: () => {},                 // TODO edit mode
};

const bodyProps = computed(() => ({
	clipId: props.rawBody ? null : props.clip.id,
	trackId: props.trackId,
	startTime: startTime.value,
	endTime: endTime.value,
	startVisibleTime: startVisibleTime.value,
	endVisibleTime: endVisibleTime.value,
	fullyVisible: fullyVisible.value,
	pixelsPerTick: editor.pixelsPerTick.value,
	pixelsPerRow: editor.rowHeight.value,
	isEditMode: props.rawBody,                     // raw bodies always editable
	isSelected: false,                             // TODO
	api: bodyApi,
}));

const ChromeComp = computed(() => props.trackDef.components.clipChrome || DefaultClipChrome);
const BodyComp   = computed(() => props.trackDef.components.clipBody);

const chromeProps = computed(() => ({
	clipId: props.clip.id,
	label: props.clip.name || '',
	resizable: props.trackDef.clips?.resizable ?? 'edge',
	scalable:  props.trackDef.clips?.scalable  ?? 'none',
	selected: false,
	editing: false,
}));

</script>
<template>
	<div
		v-if="isOnScreen || rawBody"
		class="vtm-clip"
		:class="{ 'vtm-clip--raw': rawBody }"
		:style="rawBody
			? { left: 0, width: '100%', height: pixelHeight + 'px' }
			: { left: startPx + 'px', width: widthPx + 'px', height: pixelHeight + 'px' }"
	>
		<component :is="BodyComp" v-bind="bodyProps" />
		<component
			v-if="!rawBody"
			:is="ChromeComp"
			v-bind="chromeProps"
		/>
	</div>
</template>
<style lang="scss" scoped>

.vtm-clip {
	position: absolute;
	top: 0;
	box-sizing: border-box;
	contain: layout paint;

	&--raw {
		position: relative;
		left: 0 !important;
	}
}

</style>
