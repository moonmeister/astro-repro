import { defineConfig } from 'astro/config';

export default defineConfig({
	security: {
		csp: {
			scriptDirective: { strictDynamic: true },
		},
	},
});
