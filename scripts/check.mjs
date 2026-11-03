// Checks the built page: which <script src> files can load under the CSP <meta>?
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const policy = /<meta http-equiv="content-security-policy" content="([^"]*)"/.exec(html)?.[1] ?? '';
const scriptSrc = policy.split(';').find((d) => d.trim().startsWith('script-src'))?.trim() ?? '';
const strictDynamic = scriptSrc.includes("'strict-dynamic'");
console.log(`script-src has 'strict-dynamic': ${strictDynamic}`);
console.log("With 'strict-dynamic', 'self' is ignored: a <script src> in the HTML needs a nonce, or a hash plus a matching integrity attribute.\n");

let blocked = 0;
for (const [tag] of html.matchAll(/<script\b[^>]*\ssrc="[^"]*"[^>]*>/g)) {
	const allowed = !strictDynamic || /\s(nonce|integrity)=/.test(tag);
	if (!allowed) blocked++;
	console.log(`${allowed ? 'allowed' : 'BLOCKED'}  ${tag}`);
}
process.exitCode = blocked ? 1 : 0;
console.log(blocked ? `\n${blocked} of Astro's own script files can't load` : '\nAll script files can load');
