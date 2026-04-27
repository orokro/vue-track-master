<!--
	DefaultHeader.vue
	-----------------
	Built-in fallback track header. Shown when the consumer does not
	provide their own `components.header` on the track definition.
	Renders the track name, an enable toggle, and a collapse caret.
-->
<script setup>

import { computed } from 'vue';

const props = defineProps({
	trackId: { type: String, required: true },
	collapsed: { type: Boolean, default: false },
	enabled: { type: Boolean, default: true },
	pixelHeight: { type: Number, required: true },
	api: { type: Object, required: true },
	displayName: { type: String, default: '' },
});

const label = computed(() => props.displayName || props.trackId);

</script>
<template>
	<div class="vtm-default-header" :class="{ 'is-disabled': !enabled }">
		<button
			class="vtm-default-header__caret"
			:aria-expanded="!collapsed"
			:title="collapsed ? 'Expand' : 'Collapse'"
			@click="api.toggleCollapsed()"
		>{{ collapsed ? '▸' : '▾' }}</button>
		<span class="vtm-default-header__label">{{ label }}</span>
		<input
			type="checkbox"
			class="vtm-default-header__enable"
			:checked="enabled"
			:title="enabled ? 'Disable track' : 'Enable track'"
			@change="api.setEnabled($event.target.checked)"
		/>
	</div>
</template>
<style lang="scss" scoped>

.vtm-default-header {
	display: flex;
	align-items: center;
	gap: 6px;
	padding: 4px 8px;
	height: 100%;
	background: var(--vtm-header-bg, #2a2a2a);
	color: var(--vtm-header-fg, #ddd);
	border-right: 1px solid var(--vtm-border, #444);
	border-bottom: 1px solid var(--vtm-border, #444);
	font: 12px/1.2 system-ui, sans-serif;
	box-sizing: border-box;
	user-select: none;

	&.is-disabled {
		opacity: 0.5;
	}

	&__caret {
		background: none;
		border: 0;
		color: inherit;
		cursor: pointer;
		padding: 2px 4px;
		font-size: 10px;
	}

	&__label {
		flex: 1 1 auto;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__enable {
		flex: 0 0 auto;
		cursor: pointer;
	}
}

</style>
