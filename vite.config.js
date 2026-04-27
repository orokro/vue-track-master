/*
	vite.config.js
	--------------
	Two build targets share one config:
	  - Default / `dev`        - serves the demo harness (src/main.js -> src/App.vue).
	  - `build --mode lib`     - emits the library bundle from src/lib/index.js.
	The demo entry is index.html at the project root, so dev mode just works.
*/

import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode }) => {
	const isLib = mode === 'lib';
	return {
		plugins: [
			vue(),
			...(isLib ? [] : [vueDevTools()]),
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},
		build: isLib
			? {
				lib: {
					entry: fileURLToPath(new URL('./src/lib/index.js', import.meta.url)),
					name: 'VueTrackMaster',
					fileName: (format) => `vue-track-master.${format === 'es' ? 'js' : 'umd.cjs'}`,
					formats: ['es', 'umd'],
				},
				rollupOptions: {
					external: ['vue'],
					output: { globals: { vue: 'Vue' } },
				},
				cssCodeSplit: false,
				sourcemap: true,
			}
			: {
				outDir: 'dist-demo',
				sourcemap: true,
			},
	};
});
