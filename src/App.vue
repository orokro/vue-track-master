<!--
	App.vue (demo)
	--------------
	Demo harness. Mounts a piano roll, a drum track, and two curve
	tracks. Verifies:
	  - layered headers (controls block + grow region)
	  - dynamic row count via header api.setRows (octave toggle, drum
	    pick) re-derives track height
	  - minHeightPx keeps controls block visible when rows = 0
	  - custom track background (piano octave banding) layered over
	    the default grid
-->
<script setup>

import { ref } from 'vue';
import { VueTrackMaster, musicTicks } from '@/lib/index.js';
import { PianoRollTrack } from '@/demo/tracks/piano/PianoRollTrack.js';
import { DrumTrack } from '@/demo/tracks/drum/DrumTrack.js';
import { CurveTrack } from '@/demo/tracks/curve/CurveTrack.js';

const DURATION = 32 * 3840;

const tracks = ref([
	{ id: 't-piano', def: PianoRollTrack, name: 'Lead', stretch: 1.0 },
	{ id: 't-drum',  def: DrumTrack,      name: 'Drums' },
	{ id: 't-cv-1',  def: CurveTrack,     name: 'Filter Cutoff' },
	{ id: 't-cv-2',  def: CurveTrack,     name: 'Pitch Bend' },
]);

const clipsByTrack = ref({
	't-piano': [
		{ id: 'p-a', start: 0,           end: 8 * 3840,  name: 'Clip #0' },
		{ id: 'p-b', start: 8 * 3840,    end: 16 * 3840, name: 'Clip #1' },
		{ id: 'p-c', start: 20 * 3840,   end: 28 * 3840, name: 'Clip #2' },
	],
	't-drum': [
		{ id: 'd-a', start: 0,         end: 32 * 3840, name: 'Beat' },
	],
	't-cv-1': [
		{ id: 'cv1-a', start: 4 * 3840, end: 16 * 3840, name: 'Sweep' },
	],
	't-cv-2': [],
});

const ticks = musicTicks();

</script>
<template>
	<div class="demo-shell">
		<header class="demo-shell__bar">
			<strong>VueTrackMaster demo</strong>
			<span class="demo-shell__hint">
				wheel: scroll &bull; shift+wheel: pan time &bull; ctrl+wheel: zoom time &bull; alt+wheel: zoom rows
			</span>
		</header>
		<main class="demo-shell__main">
			<VueTrackMaster
				:tracks="tracks"
				:clips-by-track="clipsByTrack"
				:duration="DURATION"
				:tick-defs="ticks"
				:pixels-per-tick="0.04"
				:row-height="14"
				:header-width="200"
			/>
		</main>
	</div>
</template>
<style lang="scss" scoped>

.demo-shell {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	background: #111;
	color: #ddd;
	font: 13px/1.4 system-ui, sans-serif;

	&__bar {
		flex: 0 0 auto;
		padding: 8px 12px;
		background: #1d1d1d;
		border-bottom: 1px solid #333;
		display: flex;
		gap: 16px;
		align-items: baseline;
	}

	&__hint {
		color: #888;
		font-size: 11px;
	}

	&__main {
		flex: 1 1 auto;
		min-height: 0;
		min-width: 0;
		display: flex;
	}

	&__main > * {
		flex: 1 1 auto;
		min-width: 0;
	}
}

</style>
