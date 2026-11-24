// Runs before first paint (blocking, external for CSP). Gates JS-only styles
// (scroll reveal, disclosure animation) so the page is fully usable without JS.
document.documentElement.classList.add('js');
