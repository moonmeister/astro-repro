import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
	integrations: [starlight({ title: 'Search late-load repro' }), loadScriptsAfterParse()],
});

/**
 * Stands in for a CSP with 'strict-dynamic' on a static site: without nonces,
 * <script src> files in the HTML are blocked, so each one is added by an inline
 * loader instead (which can be hashed). The loader adds the module once the page
 * has parsed, so it runs after DOMContentLoaded.
 */
function loadScriptsAfterParse() {
	return {
		name: 'load-scripts-after-parse',
		hooks: {
			'astro:build:done': async ({ dir }) => {
				const root = fileURLToPath(dir);
				for (const file of await readdir(root, { recursive: true })) {
					if (!file.endsWith('.html')) continue;
					const page = path.join(root, file);
					const html = await readFile(page, 'utf8');
					await writeFile(
						page,
						html.replace(
							/<script type="module" src="([^"]+)"><\/script>/g,
							(_, src) =>
								`<script>document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('script');s.type='module';s.src=${JSON.stringify(src)};document.head.append(s)})</script>`,
						),
					);
				}
			},
		},
	};
}
