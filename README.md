# Astro's CSP `<meta>` comes after scripts in `<head>`

Minimal reproduction for [withastro/astro#18606](https://github.com/withastro/astro/issues/18606), on Astro 7.4.5 with `security: { csp: true }` and nothing else.

```sh
npm install
npm run check     # builds, then lists which scripts come before the CSP <meta>
npm run preview   # open the page; each line says whether its script ran
```

Or open it in StackBlitz: https://stackblitz.com/github/moonmeister/astro-repro/tree/meta-placement

## What happens

Astro adds the CSP `<meta http-equiv="content-security-policy">` at the end of `<head>`. A `<meta>` policy only applies to content after it ([CSP spec](https://w3c.github.io/webappsec-csp/#meta-element)), so any script in `<head>` runs outside the policy.

`src/pages/index.astro` has the same script, a `data:` URL that `script-src 'self'` doesn't allow, in two places:

| Script | In the browser | Expected |
| --- | --- | --- |
| In `<head>` | **Runs** | Blocked by CSP |
| In `<body>` | Blocked by CSP | Blocked by CSP |

`npm run check` prints:

```
NOT COVERED  <script src="data:text/javascript,window.headScriptRan=true">
covered      <script src="data:text/javascript,window.bodyScriptRan=true">
covered      <script type="module">
```

This applies to anything in `<head>` before the `<meta>`: `is:inline` scripts (which also hides [#16664](https://github.com/withastro/astro/issues/16664) for scripts in `<head>`; see the [`csp-is-inline` branch](https://github.com/moonmeister/astro-repro/tree/csp-is-inline)), third-party snippets such as analytics, and anything injected there.

Putting the `<meta>` right after `<meta charset>`, before any other element in `<head>`, would cover them.
