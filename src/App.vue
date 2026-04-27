<!--
	App.vue (demo)
	--------------
	Demo harness for VueTrackMaster. Spins up a few tracks of different
	kinds with hardcoded clips. Verifies:
	  - root component mounts
	  - timeline renders ticks
	  - tracks render with sticky headers
	  - clips render at correct positions
	  - default vs custom headers
	  - default chrome vs raw bodies (mixed mode)
	  - scroll/zoom (mouse wheel, ctrl/shift/alt modifiers)
-->
<script setup>

import { ref } from 'vue';
import { VueTrackMaster, musicTicks } from '@/lib/index.js';
import { CurveTrack } from '@/demo/tracks/curve/CurveTrack.js';
import { MidiTrack } from '@/demo/tracks/midi/MidiTrack.js';

const DURATION = 32 * 3840;

const tracks = ref([
	{ id: 't-curve-1', def: CurveTrack, name: 'Pitch Bend', stretch: 1.0 },
	{ id: 't-midi-1',  def: MidiTrack,  name: 'Bass' },
	{ id: 't-midi-2',  def: MidiTrack,  name: 'Lead' },
	{ id: 't-curve-2', def: CurveTrack, name: 'Filter Cutoff' },
]);

const clipsByTrack = ref({
	't-curve-1': [
		{ id: 'c-cv1-a', start: 0,           end: 8 * 3840,  name: 'Intro' },
		{ id: 'c-cv1-b', start: 12 * 3840,   end: 24 * 3840, name: 'Drop' },
	],
	't-midi-1': [
		{ id: 'c-mid1-a', start: 0,         end: 16 * 3840, name: 'A' },
		{ id: 'c-mid1-b', start: 16 * 3840, end: 32 * 3840, name: 'B' },
	],
	't-midi-2': [
		{ id: 'c-mid2-a', start: 4 * 3840,  end: 12 * 3840, name: 'Hook' },
		{ id: 'c-mid2-b', start: 16 * 3840, end: 20 * 3840 },
		{ id: 'c-mid2-c', start: 22 * 3840, end: 30 * 3840, name: 'Outro' },
	],
	't-curve-2': [],
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
