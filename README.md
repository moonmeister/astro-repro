# `security.csp` and `<script is:inline>`

Minimal reproduction for [withastro/astro#16664](https://github.com/withastro/astro/issues/16664), on Astro 7.4.5 with `security: { csp: true }` and nothing else.

```sh
npm install
npm run check     # builds, then checks each inline script's hash against the CSP <meta>
npm run preview   # open the page; each line says whether its script ran
```

Or open it in StackBlitz: https://stackblitz.com/github/moonmeister/astro-repro/tree/csp-is-inline

## What happens

`src/pages/index.astro` has two scripts in `<body>`:

| Script | Hash in `script-src`? | In the browser | Expected |
| --- | --- | --- | --- |
| `<script is:inline>` | No | Blocked: `Executing inline script violates the following Content Security Policy directive…` | Runs, with its hash in the policy |
| `<script>` (bundled) | Yes | Runs | Runs |

`npm run check` prints:

```
MISSING HASH  <script> "document.getElementById('inline').textContent = 'r"…
allowed       <script type="module"> "document.getElementById(`bundled`).textContent=`ra"…
```

`is:inline` script bodies never reach the hash list, so the browser blocks them. The build gives no warning, and the docs don't mention it. The workaround is to hash each one by hand with `Astro.csp.insertScriptHash()`.

The scripts are in `<body>` on purpose: an `is:inline` script in `<head>` appears to work, because Astro adds the CSP `<meta>` at the end of `<head>` and the policy doesn't cover anything before it. That's a separate problem, reproduced on the [`meta-placement` branch](https://github.com/moonmeister/astro-repro/tree/meta-placement).
