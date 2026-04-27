<!--
	MidiBody.vue (demo)
	-------------------
	Stub clip body for the midi track. Renders a sparse grid of fake
	notes laid out over the visible time range to prove that the body
	receives meaningful pixelsPerTick / pixelsPerRow / visible bounds.
-->
<script setup>

import { computed } from 'vue';

const props = defineProps({
	clipId:           { type: [String, null], default: null },
	trackId:          { type: String, required: true },
	startTime:        { type: Number, required: true },
	endTime:          { type: Number, required: true },
	startVisibleTime: { type: Number, required: true },
	endVisibleTime:   { type: Number, required: true },
	fullyVisible:     { type: Boolean, default: false },
	pixelsPerTick:    { type: Number, required: true },
	pixelsPerRow:     { type: Number, required: true },
	isEditMode:       { type: Boolean, default: false },
	isSelected:       { type: Boolean, default: false },
	api:              { type: Object, required: true },
});

// Generate some fake notes deterministically based on clipId so each
// clip looks distinct without needing real data.
const notes = computed(() => {
	const seed = hash(props.clipId || props.trackId);
	const dur = props.endTime - props.startTime;
	const out = [];
	for (let i = 0; i < 24; i++) {
		const r = pseudo(seed + i);
		out.push({
			id: `n${i}`,
			localStart: r * dur,
			localLen: 200 + (r * 600 | 0),
			row: (r * 8) | 0,
		});
	}
	return out;
});

function hash(s) {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function pseudo(n) {
	let x = (n + 0x9e3779b9) | 0;
	x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
	x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
	x ^= x >>> 16;
	return ((x >>> 0) % 1000) / 1000;
}

</script>
<template>
	<div class="midi-body">
		<div
			v-for="n in notes"
			:key="n.id"
			class="midi-body__note"
			:style="{
				left: (n.localStart * pixelsPerTick) + 'px',
				width: (n.localLen * pixelsPerTick) + 'px',
				top: (n.row * pixelsPerRow) + 'px',
				height: (pixelsPerRow - 2) + 'px',
			}"
		/>
	</div>
</template>
<style lang="scss" scoped>

.midi-body {
	position: absolute;
	inset: 0;
	pointer-events: none;

	&__note {
		position: absolute;
		background: var(--demo-note, #ffd24a);
		border: 1px solid rgba(0, 0, 0, 0.4);
		border-radius: 2px;
		min-width: 2px;
	}
}

</style>
