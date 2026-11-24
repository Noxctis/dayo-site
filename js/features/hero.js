import { qs, rafThrottle, prefersReducedMotion, canHover } from '../lib/dom.js';

/** Hero: cloud parallax while visible, and a subtle pointer-follow on the jet. */
export function initHero() {
  const hero = qs('[data-hero]');
  if (!hero || prefersReducedMotion()) return;

  let inView = true;
  const onScroll = rafThrottle(() => {
    if (inView) hero.style.setProperty('--scroll-y', Math.round(scrollY));
  });
  new IntersectionObserver(([entry]) => (inView = entry.isIntersecting)).observe(hero);
  addEventListener('scroll', onScroll, { passive: true });

  if (canHover()) {
    const onMove = rafThrottle((e) => {
      hero.style.setProperty('--mx', (e.clientX / innerWidth - 0.5).toFixed(3));
      hero.style.setProperty('--my', (e.clientY / innerHeight - 0.5).toFixed(3));
    });
    hero.addEventListener('pointermove', onMove);
  }
}
