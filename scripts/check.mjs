// Checks the built page: is each inline script's hash in the CSP <meta>?
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const policy = /<meta http-equiv="content-security-policy" content="([^"]*)"/.exec(html)?.[1] ?? '';
const scriptSrc = policy.split(';').find((d) => d.trim().startsWith('script-src')) ?? '';
console.log(`${scriptSrc.trim()}\n`);

let missing = 0;
for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
	const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`;
	const allowed = scriptSrc.includes(hash);
	if (!allowed) missing++;
	console.log(`${allowed ? 'allowed     ' : 'MISSING HASH'}  <script${attrs}> ${JSON.stringify(body.trim().slice(0, 50))}…\n  ${hash}`);
}
process.exitCode = missing ? 1 : 0;
console.log(missing ? `\n${missing} inline script(s) missing from script-src` : '\nAll inline scripts are allowed');
