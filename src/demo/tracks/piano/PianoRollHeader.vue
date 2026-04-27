<!--
	PianoRollHeader.vue (demo)
	--------------------------
	Two stacked sections:
	  - Top: track name + mute/solo + octave toggle buttons
	  - Bottom: vertical keyboard, one row per enabled semitone

	Octave toggle mutates state.enabledOctaves AND calls api.setRows()
	so the editor recomputes track height. The track is also given a
	minHeightPx via the def so the controls block always fits even
	when rows=0.
-->
<script setup>

import { computed } from 'vue';

const props = defineProps({
	trackId:     { type: String, required: true },
	collapsed:   { type: Boolean, default: false },
	enabled:     { type: Boolean, default: true },
	pixelHeight: { type: Number, required: true },
	api:         { type: Object, required: true },
	displayName: { type: String, default: '' },
	state:       { type: Object, required: true },
});

const ALL_OCTAVES = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];
const NOTE_NAMES = ['C', 'B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#'];
// Top-down order within an octave so row 0 is the highest pitch.

function isEnabled(o) { return props.state.enabledOctaves.has(o); }

function toggleOctave(o) {
	const set = props.state.enabledOctaves;
	if (set.has(o)) set.delete(o); else set.add(o);
	const count = set.size * 12;
	props.api.setRows(count);
}

const visibleNotes = computed(() => {
	const list = [];
	const octs = [...props.state.enabledOctaves].sort((a, b) => b - a);
	for (const oct of octs) {
		for (const name of NOTE_NAMES) {
			list.push({ name, oct, label: `${name}${oct}` });
		}
	}
	return list;
});

</script>
<template>
	<div class="piano-header" :class="{ 'is-disabled': !enabled }">
		<div class="piano-header__controls">
			<div class="piano-header__row">
				<button class="piano-header__caret" @click="api.toggleCollapsed()">
					{{ collapsed ? '>' : 'v' }}
				</button>
				<span class="piano-header__name">{{ displayName || trackId }}</span>
				<input
					type="checkbox"
					:checked="enabled"
					@change="api.setEnabled($event.target.checked)"
				/>
			</div>
			<div class="piano-header__row piano-header__btns">
				<span class="piano-header__lbl">Mute</span>
				<span class="piano-header__lbl">Solo</span>
			</div>
			<div class="piano-header__row piano-header__octs">
				<button
					v-for="o in ALL_OCTAVES"
					:key="o"
					class="piano-header__oct"
					:class="{ 'is-on': isEnabled(o) }"
					@click="toggleOctave(o)"
				>{{ o }}</button>
			</div>
		</div>
		<div class="piano-header__keys" :class="{ 'is-empty': visibleNotes.length === 0 }">
			<div
				v-for="(n, i) in visibleNotes"
				:key="i"
				class="piano-header__key"
				:class="{ 'is-black': n.name.includes('#') }"
			>{{ n.label }}</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.piano-header {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #2a3540;
	color: #cfeefa;
	font: 11px/1.2 system-ui, sans-serif;
	border-right: 1px solid #444;
	border-bottom: 1px solid #444;
	box-sizing: border-box;
	user-select: none;

	&.is-disabled { opacity: 0.5; }

	&__controls {
		flex: 0 0 auto;
		padding: 4px 6px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		background: #1f2832;
		border-bottom: 1px solid #444;
	}

	&__row { display: flex; gap: 4px; align-items: center; }

	&__caret { background: none; border: 0; color: inherit; cursor: pointer; }
	&__name { flex: 1 1 auto; font-weight: 600; overflow: hidden; text-overflow: ellipsis; }

	&__btns {
		font-size: 9px;
	}
	&__lbl {
		background: #3a4754; color: inherit; border: 1px solid #4a5764;
		padding: 1px 6px; border-radius: 2px;
	}

	&__octs { flex-wrap: wrap; }
	&__oct {
		background: #2c3a48;
		color: #4a6071;
		border: 1px solid #3a4a5a;
		padding: 0 5px;
		font: inherit;
		cursor: pointer;
		border-radius: 2px;
		min-width: 18px;
		&.is-on { background: #f3da69; color: #2a2a2a; border-color: #c9b048; }
	}

	&__keys {
		flex: 1 1 auto;
		min-height: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		background: #ddd;
		color: #222;

		&.is-empty {
			background: #1a1f25;
		}
	}

	&__key {
		flex: 1 1 0;
		min-height: 0;
		padding: 0 4px;
		font-size: 9px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(0, 0, 0, 0.15);

		&.is-black {
			background: #333;
			color: #ccc;
		}
	}
}

</style>
