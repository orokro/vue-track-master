<!--
	DefaultTrackBackground.vue
	--------------------------
	Library default track-grid renderer. Painted as the bottom layer
	of every track body, beneath raw bodies and clips. Builds the
	background from the editor's tickDefs:
	  - Each TickDef with `gridLine > 0` becomes a repeating
	    vertical-line gradient.
	  - The first TickDef with `gridDot: true` becomes a repeating
	    dot pattern aligned to its tick interval x rowHeight.
	Cost is one DOM node per track regardless of zoom or duration -
	the browser handles the gradient repeat natively.

	Consumers wanting row banding, octave shading, or scale guides
	can replace this via track.def.components.background.
-->
<script setup>

import { computed } from 'vue';
import { useEditor } from '../composables/use-editor.js';
import { resolveTicks } from '../time.js';

const props = defineProps({
	trackId:     { type: String, required: true },
	pixelHeight: { type: Number, required: true },
	state:       { type: Object, default: null },
});

const editor = useEditor();

const lineLayers = computed(() => {
	const layers = [];
	const ppt = editor.pixelsPerTick.value;
	for (const def of editor.tickDefs.value) {
		const h = def.gridLine ?? 0;
		if (!h) continue;
		const tickPx = resolveTicks(def, 0) * ppt;
		if (tickPx < 2) continue; // skip when lines would visually merge
		const color = def.gridLineColor || 'var(--vtm-grid-line, #3a3a3a)';
		// 1px-wide repeating line at every tickPx, sized to height fraction.
		const heightPct = (h * 100).toFixed(1) + '%';
		layers.push({
			image: `linear-gradient(${color}, ${color})`,
			size: `1px ${heightPct}`,
			repeat: `repeat-x`,
			position: '0 0',
			step: tickPx,
		});
	}
	return layers;
});

const dotLayer = computed(() => {
	const ppt = editor.pixelsPerTick.value;
	const ppr = editor.rowHeight.value;
	const def = editor.tickDefs.value.find((d) => d.gridDot);
	if (!def) return null;
	const tickPx = resolveTicks(def, 0) * ppt;
	if (tickPx < 4 || ppr < 4) return null; // too dense -> skip
	return {
		stepX: tickPx,
		stepY: ppr,
	};
});

// Compose the CSS background-image / background-size / background-position
// triplets. `repeating-linear-gradient` is the cheapest way to tile a
// vertical line across the full track width.
const styleObj = computed(() => {
	const images = [];
	const sizes = [];
	const positions = [];
	const repeats = [];

	if (dotLayer.value) {
		const { stepX, stepY } = dotLayer.value;
		images.push('radial-gradient(circle, var(--vtm-grid-dot, #2e2e2e) 1px, transparent 1.4px)');
		sizes.push(`${stepX}px ${stepY}px`);
		positions.push('0 0');
		repeats.push('repeat');
	}

	for (const layer of lineLayers.value) {
		images.push(`repeating-linear-gradient(90deg, ${cssColor(layer)} 0 1px, transparent 1px ${layer.step}px)`);
		sizes.push(`100% ${layer.size.split(' ')[1]}`);
		positions.push('0 0');
		repeats.push('no-repeat');
	}

	return {
		backgroundImage: images.join(', '),
		backgroundSize: sizes.join(', '),
		backgroundPosition: positions.join(', '),
		backgroundRepeat: repeats.join(', '),
	};
});

function cssColor(layer) {
	// extract color from "linear-gradient(<color>, <color>)" stub
	const m = /linear-gradient\(([^,]+),/.exec(layer.image);
	return m ? m[1].trim() : '#3a3a3a';
}

</script>
<template>
	<div class="vtm-track-bg" :style="styleObj"></div>
</template>
<style lang="scss" scoped>

.vtm-track-bg {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}

</style>
