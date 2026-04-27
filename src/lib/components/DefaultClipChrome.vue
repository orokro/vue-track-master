<!--
	DefaultClipChrome.vue
	---------------------
	Visual frame around a clip body: header strip with title, edge
	resize handles (when resizable), and scale handles (when scalable).
	Drag/resize gesture wiring is intentionally minimal in v0 - the
	hooks just emit events; Clip.vue can later wire actual gestures.
-->
<script setup>

import { computed } from 'vue';

const props = defineProps({
	clipId: { type: String, required: true },
	label: { type: String, default: '' },
	resizable: { type: String, default: 'none' },   // 'edge' | 'none'
	scalable:  { type: String, default: 'none' },   // 'edge' | 'none'
	selected:  { type: Boolean, default: false },
	editing:   { type: Boolean, default: false },
});

const showResize = computed(() => props.resizable === 'edge');
const showScale  = computed(() => props.scalable  === 'edge');

const emit = defineEmits([
	'request-edit-mode',
	'request-resize-start',
	'request-scale-start',
]);

</script>
<template>
	<div
		class="vtm-clip-chrome"
		:class="{ 'is-selected': selected, 'is-editing': editing }"
	>
		<div class="vtm-clip-chrome__title" @dblclick="emit('request-edit-mode')">
			{{ label || clipId }}
		</div>
		<slot />
		<div
			v-if="showResize"
			class="vtm-clip-chrome__handle vtm-clip-chrome__handle--resize-l"
			@pointerdown="emit('request-resize-start', { side: 'left', kind: 'resize', event: $event })"
		/>
		<div
			v-if="showResize"
			class="vtm-clip-chrome__handle vtm-clip-chrome__handle--resize-r"
			@pointerdown="emit('request-resize-start', { side: 'right', kind: 'resize', event: $event })"
		/>
		<div
			v-if="showScale"
			class="vtm-clip-chrome__handle vtm-clip-chrome__handle--scale-l"
			@pointerdown="emit('request-scale-start', { side: 'left', kind: 'scale', event: $event })"
		/>
		<div
			v-if="showScale"
			class="vtm-clip-chrome__handle vtm-clip-chrome__handle--scale-r"
			@pointerdown="emit('request-scale-start', { side: 'right', kind: 'scale', event: $event })"
		/>
	</div>
</template>
<style lang="scss" scoped>

.vtm-clip-chrome {
	position: absolute;
	inset: 0;
	background: var(--vtm-clip-bg, rgba(80, 130, 200, 0.20));
	border: 1px solid var(--vtm-clip-border, rgba(120, 170, 230, 0.6));
	border-radius: 3px;
	box-sizing: border-box;
	overflow: hidden;
	color: var(--vtm-clip-fg, #ddd);
	font: 11px/1.2 system-ui, sans-serif;

	&.is-selected {
		border-color: var(--vtm-clip-border-selected, #ffd24a);
		box-shadow: 0 0 0 1px var(--vtm-clip-border-selected, #ffd24a);
	}

	&.is-editing {
		border-color: var(--vtm-clip-border-editing, #4adfff);
	}

	&__title {
		position: absolute;
		left: 0; right: 0; top: 0;
		padding: 2px 6px;
		background: var(--vtm-clip-title-bg, rgba(0, 0, 0, 0.35));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: text;
		user-select: none;
	}

	&__handle {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 6px;
		cursor: ew-resize;
		background: transparent;

		&:hover {
			background: var(--vtm-clip-handle-hover, rgba(255, 255, 255, 0.2));
		}

		&--resize-l { left: 0; }
		&--resize-r { right: 0; }
		&--scale-l  { left:  6px; cursor: col-resize; }
		&--scale-r  { right: 6px; cursor: col-resize; }
	}
}

</style>
