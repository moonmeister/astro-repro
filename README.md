# Starlight search never initializes if its script runs after `DOMContentLoaded`

Minimal reproduction, on Starlight 0.42.8 and Astro 7.4.5.

```sh
npm install
npm run build && npm run preview
```

Open the site, click **Search**, and type "pagefind". Or open it in StackBlitz: https://stackblitz.com/github/moonmeister/astro-repro/tree/starlight-search-late-load

## What happens

The search dialog opens empty: no input, no results, nothing logged.

`<site-search>` sets up Pagefind in a `DOMContentLoaded` listener ([`Search.astro`](https://github.com/withastro/starlight/blob/main/packages/starlight/src/components/Search.astro#L127)). If the component's script runs after that event has fired, the listener never runs.

Starlight's default output doesn't hit this, because module scripts run before `DOMContentLoaded`. Here, a small build step in `astro.config.mjs` (`loadScriptsAfterParse`) replaces each `<script type="module" src>` with an inline loader that adds the same module after the page has parsed. That's how a static site has to load its scripts under a Content Security Policy with `'strict-dynamic'` and no nonces: `<script src>` files in the HTML are blocked, and only scripts added by a hashed inline script are allowed.

| | Search input | Results for "pagefind" |
| --- | --- | --- |
| Starlight 0.42.8 (this repo) | None | – |
| With the readiness check below | Yes | 2 |

## Fix

Check `document.readyState` before waiting for the event:

```js
if (document.readyState === 'loading') {
	window.addEventListener('DOMContentLoaded', initPagefind);
} else {
	initPagefind();
}
```

`@astrojs/starlight-docsearch` (`DocSearch.astro`) uses the same pattern.
