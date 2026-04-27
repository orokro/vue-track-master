<!--
	PianoRollBackground.vue (demo)
	------------------------------
	Custom track background for the piano roll. Reuses the library's
	default grid (dots + bar/beat lines) and adds:
	  - octave banding (alternating shades every 12 rows)
	  - row separator lines for the C of each octave
	The default would already render the dots and verticals; we just
	stack our own banding underneath via z-order.
-->
<script setup>

import { computed } from 'vue';
import { DefaultTrackBackground } from '@/lib/index.js';

const props = defineProps({
	trackId:     { type: String, required: true },
	pixelHeight: { type: Number, required: true },
	state:       { type: Object, required: true },
});

const SEMI = 12;

// Background-image strings for octave banding. Two alternating shades
// every 12 rows, plus a darker line at each octave boundary.
const bandingStyle = computed(() => {
	const rowPx = state => state.pixelsPerRow || 14;
	// We can't read editor here directly without an extra useEditor;
	// instead the parent passes pixelHeight and we just need the per-row
	// height from the global rowHeight inferred from total/rows.
	// Simpler: read from --vtm-row-height if set, else fall back via
	// pixelHeight / (state.enabledOctaves.size * 12).
	const rows = props.state.enabledOctaves.size * SEMI || 1;
	const rh = props.pixelHeight / rows;
	const octPx = SEMI * rh;
	return {
		backgroundImage: [
			`repeating-linear-gradient(180deg, var(--demo-piano-band-a, #1c2230) 0 ${octPx}px, var(--demo-piano-band-b, #1f2735) ${octPx}px ${octPx * 2}px)`,
		].join(', '),
		backgroundSize: '100% 100%',
		backgroundRepeat: 'repeat-y',
	};
});

</script>
<template>
	<div class="piano-bg">
		<div class="piano-bg__bands" :style="bandingStyle" />
		<DefaultTrackBackground
			:track-id="trackId"
			:pixel-height="pixelHeight"
			:state="state"
		/>
	</div>
</template>
<style lang="scss" scoped>

.piano-bg {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 0;

	&__bands {
		position: absolute;
		inset: 0;
	}
}

</style>
