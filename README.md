# Astro reproductions

Minimal reproductions for Astro issues. Each one lives on its own branch; `main` is a bare Astro project to start new ones from.

| Branch | Issue | StackBlitz |
| --- | --- | --- |
| [`csp-is-inline`](https://github.com/moonmeister/astro-repro/tree/csp-is-inline) | `security.csp` doesn't hash `<script is:inline>` ([withastro/astro#16664](https://github.com/withastro/astro/issues/16664)) | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/csp-is-inline) |
| [`meta-placement`](https://github.com/moonmeister/astro-repro/tree/meta-placement) | `security.csp`'s `<meta>` comes after scripts in `<head>`, so they aren't covered | [Open](https://stackblitz.com/github/moonmeister/astro-repro/tree/meta-placement) |

## Adding a reproduction

```sh
git switch main && git switch -c <short-name>
npm install
# reproduce the issue, with a README that says what to run, what happens and what's expected
git push -u origin <short-name>
```

Then add it to the table above on `main`. StackBlitz opens any branch at `https://stackblitz.com/github/moonmeister/astro-repro/tree/<branch>`.
