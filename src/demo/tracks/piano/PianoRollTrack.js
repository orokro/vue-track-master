/*
	PianoRollTrack.js (demo)
	------------------------
	Piano roll track with an octave-toggle header. State holds a
	reactive Set of enabled octaves; the header mutates the set and
	syncs row count via api.setRows. minHeightPx ensures the track
	stays at least as tall as the controls block even with no octaves
	enabled.
*/

import { defineTrack } from '@/lib/index.js';
import PianoRollHeader from './PianoRollHeader.vue';
import PianoRollBody from './PianoRollBody.vue';
import PianoRollBackground from './PianoRollBackground.vue';

export const PianoRollTrack = defineTrack({
	kind: 'piano-roll',
	mode: 'clips',
	components: {
		header: PianoRollHeader,
		clipBody: PianoRollBody,
		background: PianoRollBackground,
	},
	layout: {
		rows: 36,           // 3 octaves x 12 default
		minRows: 0,         // controls block governs minimum, not rows
		minHeightPx: 140,   // fits the controls block + a couple of keys
	},
	clips: {
		resizable: 'edge',
		scalable:  'none',
		sliceable: true,
		movable:   true,
		overlap:   'allow',
	},
	behavior: {
		createState: () => ({
			// reactive() will preserve Set identity but make membership reactive
			enabledOctaves: new Set([3, 4, 5]),
			byClip: new Map(),
		}),
		onClipSplice({ leftClipId, rightClipId, at }) {
			console.log('[piano] splice', { leftClipId, rightClipId, at });
		},
		onClipDelete({ clipId }) {
			console.log('[piano] delete', { clipId });
		},
	},
});
