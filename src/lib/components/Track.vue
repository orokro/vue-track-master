<!--
	Track.vue
	---------
	One row in the editor: sticky header on the left, scrollable body
	on the right. Computes pixel height from rows + stretch + the
	editor's rowHeight, floored by minRows and minHeightPx.

	Body stack (back to front):
	  1. background  - track grid (dots + lines), library default or
	                   consumer-supplied via def.components.background
	  2. raw clip    - 'raw' / 'mixed' modes only; full-width chrome-less
	  3. explicit clips - 'clips' / 'mixed' modes
-->
<script setup>

import { computed } from 'vue';
import { useEditor } from '../composables/use-editor.js';
import Clip from './Clip.vue';
import DefaultHeader from './DefaultHeader.vue';
import DefaultTrackBackground from './DefaultTrackBackground.vue';

const props = defineProps({
	track: { type: Object, required: true },
	clips: { type: Array, default: () => [] },
});

const editor = useEditor();

const def = computed(() => props.track.def);

const rows = computed(() =>
	props.track.rows ?? def.value.layout?.rows ?? 8);
const minRows = computed(() =>
	def.value.layout?.minRows ?? 4);
const minHeightPx = computed(() =>
	def.value.layout?.minHeightPx ?? 0);
const stretch = computed(() => props.track.stretch ?? 1);
const collapsed = computed(() => !!props.track.collapsed);
const enabled = computed(() => props.track.enabled !== false);

const pixelHeight = computed(() => {
	if (collapsed.value) return Math.max(24, minHeightPx.value);
	const natural = rows.value * editor.rowHeight.value * stretch.value;
	const rowFloor = minRows.value * editor.rowHeight.value;
	return Math.max(natural, rowFloor, minHeightPx.value);
});

const bodyWidthPx = computed(() => editor.totalContentWidthPx.value);

// Per-track reactive state (created lazily by the editor context).
const state = computed(() => editor.getTrackState(props.track.id, def.value));

const headerApi = {
	toggleCollapsed() { props.track.collapsed = !props.track.collapsed; },
	setEnabled(v)     { props.track.enabled = v; },
	setRows(r)        { props.track.rows = r; },
	setStretch(s)     { props.track.stretch = s; },
};

const HeaderComp = computed(() => def.value.components.header || DefaultHeader);
const BackgroundComp = computed(() =>
	def.value.components.background || DefaultTrackBackground);

const headerProps = computed(() => ({
	trackId: props.track.id,
	collapsed: collapsed.value,
	enabled: enabled.value,
	pixelHeight: pixelHeight.value,
	api: headerApi,
	displayName: props.track.name || '',
	state: state.value,
}));

const backgroundProps = computed(() => ({
	trackId: props.track.id,
	pixelHeight: pixelHeight.value,
	state: state.value,
}));

const mode = computed(() => def.value.mode);
const showRaw = computed(() => mode.value === 'raw' || mode.value === 'mixed');
const showClips = computed(() => mode.value === 'clips' || mode.value === 'mixed');

const rawClip = computed(() => ({
	id: `${props.track.id}__raw`,
	start: 0,
	end: editor.duration.value,
	name: '',
}));

</script>
<template>
	<div
		class="vtm-track"
		:class="{ 'vtm-track--collapsed': collapsed, 'vtm-track--disabled': !enabled }"
	>
		<div
			class="vtm-track__header"
			:style="{ width: editor.headerWidth.value + 'px', height: pixelHeight + 'px' }"
		>
			<component :is="HeaderComp" v-bind="headerProps" />
		</div>
		<div
			class="vtm-track__body"
			:style="{ width: bodyWidthPx + 'px', height: pixelHeight + 'px' }"
		>
			<component :is="BackgroundComp" v-bind="backgroundProps" />
			<Clip
				v-if="showRaw"
				:clip="rawClip"
				:track-id="track.id"
				:track-def="def"
				:pixel-height="pixelHeight"
				:state="state"
				:raw-body="true"
			/>
			<template v-if="showClips">
				<Clip
					v-for="clip in clips"
					:key="clip.id"
					:clip="clip"
					:track-id="track.id"
					:track-def="def"
					:pixel-height="pixelHeight"
					:state="state"
				/>
			</template>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.vtm-track {
	display: contents;

	&__header {
		position: sticky;
		left: 0;
		z-index: 2;
		background: var(--vtm-header-bg, #2a2a2a);
		border-bottom: 1px solid var(--vtm-border, #444);
	}

	&__body {
		position: relative;
		border-bottom: 1px solid var(--vtm-border, #444);
		background: var(--vtm-track-bg, #1a1a1a);
		overflow: hidden;
	}

	&--disabled { opacity: 0.6; }
}

</style>
