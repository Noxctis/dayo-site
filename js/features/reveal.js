import { qsa } from '../lib/dom.js';

/** Fade/slide elements in once as they enter the viewport. */
export function initReveal() {
  const targets = qsa('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  targets.forEach((el) => observer.observe(el));
}
