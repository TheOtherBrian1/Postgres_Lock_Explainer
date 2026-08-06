// svelte.config.js
import adapter from '@sveltejs/adapter-auto'; // or adapter-node, adapter-static, etc.

export default {
	kit: {
		adapter: adapter({
			edge: false,
			split: true
		})
	}
};
