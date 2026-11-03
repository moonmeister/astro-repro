// Imported by both scripts on the page, so Astro bundles it as a shared chunk
// and emits those scripts as files that import it.
export function mark(id: string) {
	document.getElementById(id)!.textContent = 'ran';
}
