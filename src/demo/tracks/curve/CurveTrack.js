/*
	CurveTrack.js (demo)
	--------------------
	Demo curve track definition. Mixed mode (raw + clips), edge-resize
	and edge-scale enabled. Behavior callbacks are stubs - they just
	log so we can see the event flow in the console.
*/

import { defineTrack } from '@/lib/define-track.js';
import CurveHeader from './CurveHeader.vue';
import CurveBody from './CurveBody.vue';

export const CurveTrack = defineTrack({
	kind: 'curve',
	mode: 'mixed',
	components: {
		header: CurveHeader,
		clipBody: CurveBody,
	},
	layout: {
		rows: 8,
		minRows: 4,
	},
	clips: {
		resizable: 'edge',
		scalable: 'edge',
		sliceable: true,
		movable: true,
		overlap: 'allow',
	},
	behavior: {
		createState: () => ({ byClip: new Map() }),
		onClipSplice({ leftClipId, rightClipId, at }) {
			console.log('[curve] splice', { leftClipId, rightClipId, at });
		},
		onClipRescale({ clipId, ratio }) {
			console.log('[curve] rescale', { clipId, ratio });
		},
		onClipDelete({ clipId }) {
			console.log('[curve] delete', { clipId });
		},
		onClipDuplicate({ sourceClipId, newClipId }) {
			console.log('[curve] duplicate', { sourceClipId, newClipId });
		},
	},
});
