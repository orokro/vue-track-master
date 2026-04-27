<!--
	CurveHeader.vue (demo)
	----------------------
	Custom header for the curve track. Shows a label, the current
	stretch, and a button that nudges stretch via the api. Proves the
	header api wiring works end-to-end.
-->
<script setup>

const props = defineProps({
	trackId:     { type: String, required: true },
	collapsed:   { type: Boolean, default: false },
	enabled:     { type: Boolean, default: true },
	pixelHeight: { type: Number, required: true },
	api:         { type: Object, required: true },
	displayName: { type: String, default: '' },
});

function bigger() { props.api.setStretch(2.0); }
function smaller() { props.api.setStretch(1.0); }

</script>
<template>
	<div class="curve-header" :class="{ 'is-disabled': !enabled }">
		<button class="curve-header__caret" @click="api.toggleCollapsed()">
			{{ collapsed ? '▸' : '▾' }}
		</button>
		<span class="curve-header__label">{{ displayName || trackId }}</span>
		<div class="curve-header__buttons">
			<button @click="smaller">1x</button>
			<button @click="bigger">2x</button>
			<input
				type="checkbox"
				:checked="enabled"
				@change="api.setEnabled($event.target.checked)"
			/>
		</div>
	</div>
</template>
<style lang="scss" scoped>

.curve-header {
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 6px 8px;
	height: 100%;
	background: linear-gradient(180deg, #2d3a45, #1f262d);
	color: #cfeefa;
	border-right: 1px solid #444;
	border-bottom: 1px solid #444;
	font: 12px/1.2 system-ui, sans-serif;
	box-sizing: border-box;
	user-select: none;

	&.is-disabled { opacity: 0.5; }

	&__caret {
		align-self: flex-start;
		background: none; border: 0; color: inherit; cursor: pointer; padding: 0;
	}

	&__label {
		font-weight: 600;
	}

	&__buttons {
		display: flex; gap: 4px; margin-top: auto;
		button {
			background: #1a232a; color: inherit; border: 1px solid #3b4a55;
			padding: 2px 6px; cursor: pointer; font: inherit;
		}
	}
}

</style>
