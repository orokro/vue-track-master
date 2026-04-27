<!--
	CurveBody.vue (demo)
	--------------------
	Stub clip body for the curve track. v0 just paints a colored fill
	and prints its visible time range so we can see culling math is
	right. Real curve rendering (SVG paths with handles) lands later.
-->
<script setup>

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

</script>
<template>
	<div class="curve-body">
		<div class="curve-body__info">
			{{ clipId ?? 'raw' }} | vis [{{ startVisibleTime }}, {{ endVisibleTime }})
			{{ fullyVisible ? '(full)' : '(partial)' }}
		</div>
		<svg class="curve-body__svg" preserveAspectRatio="none" viewBox="0 0 100 100">
			<path
				d="M 0 80 C 25 20, 75 20, 100 80"
				stroke="var(--demo-curve, #4adfff)"
				stroke-width="1.5"
				fill="none"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
	</div>
</template>
<style lang="scss" scoped>

.curve-body {
	position: absolute;
	inset: 0;
	pointer-events: none;
	color: rgba(255, 255, 255, 0.55);
	font: 10px/1.2 system-ui, sans-serif;

	&__info {
		position: absolute;
		bottom: 2px;
		left: 6px;
		text-shadow: 0 0 2px #000;
	}

	&__svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
}

</style>
