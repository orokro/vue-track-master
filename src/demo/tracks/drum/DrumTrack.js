/*
	DrumTrack.js (demo)
	-------------------
	Drum lane track. State holds an array of picked MIDI drums; the
	header's picker UI mutates it and re-syncs row count via setRows.
	Tall minHeightPx keeps the picker visible even with no lanes.
*/

import { defineTrack } from '@/lib/index.js';
import DrumHeader from './DrumHeader.vue';
import DrumBody from './DrumBody.vue';

export const DrumTrack = defineTrack({
	kind: 'drum',
	mode: 'clips',
	components: {
		header: DrumHeader,
		clipBody: DrumBody,
	},
	layout: {
		rows: 5,
		minRows: 0,
		minHeightPx: 130,   // fits the controls + picker grid
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
			pickedNotes: [
				{ note: 36, name: 'Kick' },
				{ note: 38, name: 'Snare' },
				{ note: 42, name: 'HH Closed' },
				{ note: 49, name: 'Crash' },
				{ note: 51, name: 'Ride' },
			],
			byClip: new Map(),
		}),
		onClipDelete({ clipId }) {
			console.log('[drum] delete', { clipId });
		},
	},
});
