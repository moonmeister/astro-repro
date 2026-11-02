# `security.csp` and `<script is:inline>`

Minimal reproduction for [withastro/astro#16664](https://github.com/withastro/astro/issues/16664), on Astro 7.4.5 with `security: { csp: true }` and nothing else.

```sh
npm install
npm run check     # builds, then checks each inline script against the CSP <meta>
npm run preview   # open the page; each line says whether its script ran
```

Or open it in StackBlitz: https://stackblitz.com/github/moonmeister/astro-csp-inline-repro

## What happens

`src/pages/index.astro` has three scripts:

| Script | Hash in `script-src`? | In the browser | Expected |
| --- | --- | --- | --- |
| `<script is:inline>` in `<body>` | No | Blocked: `Executing inline script violates the following Content Security Policy directive…` | Runs, with its hash in the policy |
| `<script is:inline>` in `<head>` | No | **Runs** | Covered by the policy (blocked without a hash, or runs with one) |
| `<script>` (bundled) | Yes | Runs | Runs |

`npm run check` prints:

```
BEFORE THE CSP META (not covered)  <script> "window.headInlineRan = true;"…
MISSING HASH  <script> "document.getElementById('body-inline').textContent"…
allowed  <script type="module"> "document.getElementById(`bundled`).textContent=`ra"…
```

## Two problems

1. **`is:inline` scripts aren't hashed** (#16664). Their bodies never reach the hash list, so the browser blocks them. The build gives no warning, and the docs don't mention it. The workaround is to hash each one by hand with `Astro.csp.insertScriptHash()`.
2. **The CSP `<meta>` goes at the end of `<head>`**, after any scripts already in `<head>`. A `<meta>` policy only applies to content after it, so those scripts aren't covered by the policy at all. This hides problem 1 for `is:inline` scripts in `<head>`: they run because they aren't covered, not because they're allowed. Any other script placed in `<head>` before the meta, including one injected there, is outside the policy too.

Putting the `<meta>` right after `<meta charset>` would fix 2, and would then surface 1 for scripts in `<head>` too.
