<!--
	DrumBody.vue (demo)
	-------------------
	Renders fake drum hits: each lane (picked drum) gets some hits at
	pseudo-random times. Square markers, since drums are usually
	rendered as instants rather than durations.
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
	state:            { type: Object, required: true },
});

const hits = computed(() => {
	const seed = hash(props.clipId || props.trackId);
	const dur = props.endTime - props.startTime;
	const out = [];
	props.state.pickedNotes.forEach((drum, lane) => {
		const count = 4 + ((seed + drum.note) % 16);
		for (let i = 0; i < count; i++) {
			const r = pseudo(seed + drum.note * 31 + i);
			out.push({
				id: `${drum.note}-${i}`,
				localStart: r * dur,
				row: lane,
			});
		}
	});
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
	<div class="drum-body">
		<div
			v-for="h in hits"
			:key="h.id"
			class="drum-body__hit"
			:style="{
				left: (h.localStart * pixelsPerTick - 3) + 'px',
				top:  (h.row * pixelsPerRow + 2) + 'px',
				width: '6px',
				height: Math.max(4, pixelsPerRow - 4) + 'px',
			}"
		/>
	</div>
</template>
<style lang="scss" scoped>

.drum-body {
	position: absolute;
	inset: 0;
	pointer-events: none;

	&__hit {
		position: absolute;
		background: #6ea16f;
		border: 1px solid #2c3a30;
		border-radius: 2px;
	}
}

</style>
