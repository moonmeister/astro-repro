# Astro reproductions

Minimal reproductions for Astro issues. Each one lives on its own branch; `main` is a bare Astro project to start new ones from.

| Branch | Issue | StackBlitz |
| --- | --- | --- |
| [`csp-is-inline`](https://github.com/moonmeister/astro-repro/tree/csp-is-inline) | `security.csp` doesn't hash `<script is:inline>` ([withastro/astro#16664](https://github.com/withastro/astro/issues/16664)) | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/csp-is-inline) |
| [`meta-placement`](https://github.com/moonmeister/astro-repro/tree/meta-placement) | `security.csp`'s `<meta>` comes after scripts in `<head>`, so they aren't covered ([withastro/astro#18606](https://github.com/withastro/astro/issues/18606)) | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/meta-placement) |
| [`csp-strict-dynamic`](https://github.com/moonmeister/astro-repro/tree/csp-strict-dynamic) | `security.csp`'s `strictDynamic` blocks Astro's own bundled `<script src>` files ([withastro/astro#18607](https://github.com/withastro/astro/issues/18607)) | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/csp-strict-dynamic) |
| [`starlight-search-late-load`](https://github.com/moonmeister/astro-repro/tree/starlight-search-late-load) | Starlight search never initializes if its script runs after `DOMContentLoaded` ([withastro/starlight#4336](https://github.com/withastro/starlight/issues/4336)) | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/starlight-search-late-load) |

## Adding a reproduction

```sh
git switch main && git switch -c <short-name>
npm install
# reproduce the issue, with a README that says what to run, what happens and what's expected
git push -u origin <short-name>
```

Then add it to the table above on `main`. StackBlitz opens any branch at `https://stackblitz.com/github/moonmeister/astro-repro/tree/<branch>`.
