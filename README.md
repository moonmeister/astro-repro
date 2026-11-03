# `security.csp.scriptDirective.strictDynamic` blocks Astro's own script files

Minimal reproduction, on Astro 7.4.5 with `security: { csp: { scriptDirective: { strictDynamic: true } } }` and nothing else.

```sh
npm install
npm run check     # builds, then lists which <script src> files can load under the policy
npm run preview   # open the page; each line says whether its script ran
```

Or open it in StackBlitz: https://stackblitz.com/github/moonmeister/astro-repro/tree/csp-strict-dynamic

## What happens

With `strictDynamic: true`, Astro adds `'strict-dynamic'` to `script-src`. Under `'strict-dynamic'`, browsers ignore `'self'` and host sources ([CSP spec](https://w3c.github.io/webappsec-csp/#strict-dynamic-usage)): a `<script src>` in the HTML only loads with a nonce, or with a hash in the policy and a matching `integrity` attribute. Astro emits its own bundled scripts as `<script type="module" src="/_astro/…">` whenever they import shared code, with neither, so the browser blocks them.

`src/pages/index.astro` has three scripts:

| Script | Built as | In the browser | Expected |
| --- | --- | --- | --- |
| Self-contained `<script>` | Inline, hashed | Runs | Runs |
| `<script>` importing `src/scripts/mark.ts` | `<script type="module" src="/_astro/…">` | Blocked: `Loading the script '…/_astro/index.astro_astro_type_script_index_1_lang….js' violates the following Content Security Policy directive…` | Runs |
| Another `<script>` importing it | `<script type="module" src="/_astro/…">` | Blocked | Runs |

`npm run check` prints:

```
BLOCKED  <script type="module" src="/_astro/index.astro_astro_type_script_index_1_lang.D2LeoRwO.js">
BLOCKED  <script type="module" src="/_astro/index.astro_astro_type_script_index_2_lang.IjQOpZPp.js">
```

Any real site has scripts like these (shared helpers, framework code), so turning on `strictDynamic` breaks them. Adding `integrity` hashes to those tags isn't enough by itself: the chunks they import, such as `mark.….js` here, carry no hash and are blocked too.
