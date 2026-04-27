/*
	main.js (demo entry)
	--------------------
	Mounts the demo App. The library itself is published from
	src/lib/index.js via vite --mode lib; this file is demo-only.
*/

import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
