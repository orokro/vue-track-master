<!--
	Track.vue
	---------
	One row in the editor: sticky header on the left, scrollable body
	on the right. Computes pixel height from layout.rows + stretch +
	the editor's global rowHeight, floored by minRows.

	Mode behavior:
	  - 'raw'    -> single full-width body (no chrome, isEditMode=true)
	  - 'clips'  -> list of Clip wrappers, no raw body
	  - 'mixed'  -> raw body underneath, clips on top
-->
<script setup>

import { computed } from 'vue';
import { useEditor } from '../composables/use-editor.js';
import Clip from './Clip.vue';
import DefaultHeader from './DefaultHeader.vue';

const props = defineProps({
	track: { type: Object, required: true },     // { id, def, name?, collapsed?, enabled?, stretch?, rows? }
	clips: { type: Array, default: () => [] },   // [{ id, start, end, name? }]
});

const editor = useEditor();

const def = computed(() => props.track.def);

const rows = computed(() =>
	props.track.rows ?? def.value.layout?.rows ?? 8);
const minRows = computed(() =>
	def.value.layout?.minRows ?? 4);
const stretch = computed(() => props.track.stretch ?? 1);
const collapsed = computed(() => !!props.track.collapsed);
const enabled = computed(() => props.track.enabled !== false);

const pixelHeight = computed(() => {
	if (collapsed.value) return Math.max(24, minRows.value * editor.rowHeight.value);
	const natural = rows.value * editor.rowHeight.value * stretch.value;
	const floor = minRows.value * editor.rowHeight.value;
	return Math.max(natural, floor);
});

const bodyWidthPx = computed(() => editor.totalContentWidthPx.value);

const headerApi = {
	toggleCollapsed() { props.track.collapsed = !props.track.collapsed; },
	setEnabled(v)     { props.track.enabled = v; },
	setRows(r)        { props.track.rows = r; },
	setStretch(s)     { props.track.stretch = s; },
};

const HeaderComp = computed(() => def.value.components.header || DefaultHeader);

const headerProps = computed(() => ({
	trackId: props.track.id,
	collapsed: collapsed.value,
	enabled: enabled.value,
	pixelHeight: pixelHeight.value,
	api: headerApi,
	displayName: props.track.name || '',
}));

const mode = computed(() => def.value.mode);
const showRaw = computed(() => mode.value === 'raw' || mode.value === 'mixed');
const showClips = computed(() => mode.value === 'clips' || mode.value === 'mixed');

// Implicit full-width raw body - mounted as one anonymous chrome-less clip.
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
		:style="{ height: pixelHeight + 'px' }"
	>
		<div class="vtm-track__header" :style="{ width: editor.headerWidth.value + 'px' }">
			<component :is="HeaderComp" v-bind="headerProps" />
		</div>
		<div class="vtm-track__body" :style="{ width: bodyWidthPx + 'px' }">
			<Clip
				v-if="showRaw"
				:clip="rawClip"
				:track-id="track.id"
				:track-def="def"
				:pixel-height="pixelHeight"
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
				/>
			</template>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.vtm-track {
	display: contents; /* CSS grid parent provides the row layout */

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

	&--disabled {
		opacity: 0.6;
	}
}

</style>
