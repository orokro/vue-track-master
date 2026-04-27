/*
	MidiTrack.js (demo)
	-------------------
	Demo midi track. Clips-only mode, edge-resizable but not scalable
	(notes don't time-stretch unless we say so). Uses the library's
	default header to verify the fallback rendering path.
*/

import { defineTrack } from '@/lib/define-track.js';
import MidiBody from './MidiBody.vue';
import DefaultHeader from '@/lib/components/DefaultHeader.vue';

export const MidiTrack = defineTrack({
	kind: 'midi',
	mode: 'clips',
	components: {
		header: DefaultHeader,
		clipBody: MidiBody,
	},
	layout: {
		rows: 8,
		minRows: 4,
	},
	clips: {
		resizable: 'edge',
		scalable: 'none',
		sliceable: true,
		movable: true,
		overlap: 'allow',
	},
	behavior: {
		createState: () => ({ byClip: new Map() }),
		onClipSplice({ leftClipId, rightClipId, at }) {
			console.log('[midi] splice', { leftClipId, rightClipId, at });
		},
		onClipDelete({ clipId }) {
			console.log('[midi] delete', { clipId });
		},
		onClipDuplicate({ sourceClipId, newClipId }) {
			console.log('[midi] duplicate', { sourceClipId, newClipId });
		},
	},
});
