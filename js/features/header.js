import { qs, qsa, rafThrottle } from '../lib/dom.js';

/** Scroll progress bar (with plane) and scroll-spy for the primary navigation. */
export function initHeader() {
  const header = qs('[data-site-header]');
  const progress = qs('.progress', header);
  const links = new Map(qsa('[data-nav]').map((a) => [a.dataset.nav, a]));

  const updateProgress = rafThrottle(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    progress.style.setProperty('--progress', ratio.toFixed(4));
  });
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const sections = [...links.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  const visible = new Set();
  const setCurrent = () => {
    // Prefer the lowest visible section in document order that crosses the viewport's focus band.
    const current = sections.filter((s) => visible.has(s.id)).pop()?.id ?? 'home';
    links.forEach((link, id) => {
      if (id === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      setCurrent();
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => observer.observe(s));
}
