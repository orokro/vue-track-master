<!--
	Timeline.vue
	------------
	Top ruler showing tick marks and labels driven by the editor's
	tickDefs. v0 renders as DOM (one element per visible tick) for
	simplicity; canvas painting is a follow-up if profile shows the
	DOM count growing into the thousands.
-->
<script setup>

import { computed } from 'vue';
import { useEditor } from '../composables/use-editor.js';
import { resolveTicks } from '../time.js';

const editor = useEditor();

const widthPx = computed(() => editor.totalContentWidthPx.value);

/**
 * Visible ticks for one TickDef. Returns absolute time positions and
 * derived label/height. Bounded by viewportStart/viewportEnd to keep
 * DOM count proportional to what's on screen, not total duration.
 */
function ticksFor(def) {
	const t = resolveTicks(def, editor.viewportStart.value);
	if (t <= 0) return [];
	const startIdx = Math.floor(editor.viewportStart.value / t);
	const endIdx = Math.ceil(editor.viewportEnd.value / t);
	const out = [];
	for (let i = startIdx; i <= endIdx; i++) {
		const time = i * t;
		if (time < 0) continue;
		out.push({
			time,
			leftPx: time * editor.pixelsPerTick.value,
			label: def.label ? def.label(i, time) : null,
			heightFrac: def.timelineHeight ?? 0,
			cssClass: def.cssClass || '',
			defName: def.name,
		});
	}
	return out;
}

const allTicks = computed(() => {
	const lines = [];
	for (const def of editor.tickDefs.value) {
		if (!def.timelineHeight) continue;
		for (const tk of ticksFor(def)) lines.push(tk);
	}
	return lines;
});

</script>
<template>
	<div class="vtm-timeline" :style="{ width: widthPx + 'px', height: editor.timelineHeight.value + 'px' }">
		<div
			v-for="tk in allTicks"
			:key="tk.defName + ':' + tk.time"
			class="vtm-timeline__tick"
			:class="tk.cssClass"
			:style="{
				left: tk.leftPx + 'px',
				height: (tk.heightFrac * 100) + '%',
			}"
		>
			<span v-if="tk.label" class="vtm-timeline__label">{{ tk.label }}</span>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.vtm-timeline {
	position: sticky;
	top: 0;
	z-index: 2;
	background: var(--vtm-timeline-bg, #222);
	border-bottom: 1px solid var(--vtm-border, #444);
	color: var(--vtm-timeline-fg, #999);
	font: 10px/1 system-ui, sans-serif;
	user-select: none;

	&__tick {
		position: absolute;
		bottom: 0;
		width: 1px;
		background: var(--vtm-timeline-tick, #555);
	}

	&__label {
		position: absolute;
		left: 3px;
		bottom: 2px;
		white-space: nowrap;
	}
}

</style>
