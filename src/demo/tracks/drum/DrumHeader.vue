<!--
	DrumHeader.vue (demo)
	---------------------
	Top: track name + Pick Drums button (opens a tiny preset picker).
	Bottom: list of currently picked drums, one row per lane.
	Picking a drum mutates state.pickedNotes and calls api.setRows.
-->
<script setup>

import { ref, computed } from 'vue';

const props = defineProps({
	trackId:     { type: String, required: true },
	collapsed:   { type: Boolean, default: false },
	enabled:     { type: Boolean, default: true },
	pixelHeight: { type: Number, required: true },
	api:         { type: Object, required: true },
	displayName: { type: String, default: '' },
	state:       { type: Object, required: true },
});

const PRESETS = [
	{ note: 36, name: 'Kick' },
	{ note: 38, name: 'Snare' },
	{ note: 42, name: 'HH Closed' },
	{ note: 46, name: 'HH Open' },
	{ note: 49, name: 'Crash' },
	{ note: 51, name: 'Ride' },
	{ note: 47, name: 'Tom Mid' },
	{ note: 41, name: 'Tom Low' },
];

const pickerOpen = ref(false);

function isPicked(n) {
	return props.state.pickedNotes.some((p) => p.note === n);
}

function togglePick(preset) {
	const arr = props.state.pickedNotes;
	const idx = arr.findIndex((p) => p.note === preset.note);
	if (idx >= 0) arr.splice(idx, 1);
	else arr.push({ ...preset });
	props.api.setRows(arr.length);
}

</script>
<template>
	<div class="drum-header" :class="{ 'is-disabled': !enabled }">
		<div class="drum-header__controls">
			<div class="drum-header__row">
				<button class="drum-header__caret" @click="api.toggleCollapsed()">
					{{ collapsed ? '>' : 'v' }}
				</button>
				<span class="drum-header__name">{{ displayName || trackId }}</span>
				<input
					type="checkbox"
					:checked="enabled"
					@change="api.setEnabled($event.target.checked)"
				/>
			</div>
			<button
				class="drum-header__pick"
				:class="{ 'is-open': pickerOpen }"
				@click="pickerOpen = !pickerOpen"
			>Pick Drums</button>
			<div v-if="pickerOpen" class="drum-header__picker">
				<button
					v-for="p in PRESETS"
					:key="p.note"
					class="drum-header__pickitem"
					:class="{ 'is-on': isPicked(p.note) }"
					@click="togglePick(p)"
				>{{ p.name }}</button>
			</div>
		</div>
		<div class="drum-header__lanes">
			<div
				v-for="(p, i) in state.pickedNotes"
				:key="p.note"
				class="drum-header__lane"
			>{{ p.name }}</div>
			<div v-if="!state.pickedNotes.length" class="drum-header__empty">
				(no drums picked)
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.drum-header {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #2c3a30;
	color: #d3edd5;
	font: 11px/1.2 system-ui, sans-serif;
	border-right: 1px solid #444;
	border-bottom: 1px solid #444;
	box-sizing: border-box;
	user-select: none;

	&.is-disabled { opacity: 0.5; }

	&__controls {
		flex: 0 0 auto;
		padding: 4px 6px;
		background: #1f2823;
		border-bottom: 1px solid #444;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	&__row { display: flex; gap: 4px; align-items: center; }
	&__caret { background: none; border: 0; color: inherit; cursor: pointer; }
	&__name { flex: 1 1 auto; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }

	&__pick {
		background: #d6c47b;
		color: #2a2a2a;
		border: 1px solid #b9a85e;
		padding: 2px 8px;
		font: inherit;
		cursor: pointer;
		border-radius: 3px;
		&.is-open { background: #ffe17a; }
	}

	&__picker {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2px;
	}
	&__pickitem {
		background: #2c3a30;
		color: #aac;
		border: 1px solid #3a4a3e;
		padding: 1px 4px;
		font: inherit;
		font-size: 9px;
		cursor: pointer;
		border-radius: 2px;
		text-align: left;
		&.is-on { background: #6ea16f; color: #1a1a1a; border-color: #4f834f; }
	}

	&__lanes {
		flex: 1 1 auto;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	&__lane {
		flex: 1 1 0;
		min-height: 0;
		padding: 0 6px;
		display: flex;
		align-items: center;
		font-size: 10px;
		background: #2a3530;
		border-bottom: 1px solid rgba(0, 0, 0, 0.3);
	}
	&__empty {
		flex: 1 1 auto;
		display: flex; align-items: center; justify-content: center;
		color: #687d6c;
		font-size: 10px;
		font-style: italic;
	}
}

</style>
