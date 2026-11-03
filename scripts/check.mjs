// Checks the built page: does anything run before the CSP <meta>, where the policy doesn't apply?
import { readFileSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const metaAt = html.indexOf('<meta http-equiv="content-security-policy"');
const headEnd = html.indexOf('</head>');
console.log(`CSP <meta> at offset ${metaAt}; </head> at ${headEnd}\n`);

let before = 0;
for (const match of html.matchAll(/<script\b[^>]*>/g)) {
	const covered = match.index > metaAt;
	if (!covered) before++;
	console.log(`${covered ? 'covered    ' : 'NOT COVERED'}  ${match[0]}`);
}
process.exitCode = before ? 1 : 0;
console.log(before ? `\n${before} script(s) come before the CSP <meta>, so the policy doesn't apply to them` : '\nThe CSP <meta> comes before every script');
