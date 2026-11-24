import { qs, qsa, clamp } from '../lib/dom.js';

/** Booking-process walkthrough. Without JS the ordered list is the whole content. */
export function initSteps() {
  const stage = qs('[data-stage]');
  const buttons = qsa('[data-step]');
  if (!stage || !buttons.length) return;

  const count = qs('[data-stage-count]', stage);
  const title = qs('[data-stage-title]', stage);
  const text = qs('[data-stage-text]', stage);
  const prev = qs('[data-step-prev]', stage);
  const next = qs('[data-step-next]', stage);
  const stops = qsa('.route__stop', stage);
  const last = buttons.length - 1;
  let index = 0;

  function go(i) {
    index = clamp(i, 0, last);
    buttons.forEach((btn, k) => {
      if (k === index) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
      btn.classList.toggle('is-done', k < index);
    });
    const active = buttons[index];
    count.textContent = `Step ${index + 1} of ${buttons.length}`;
    title.textContent = qs('.steps__title', active).textContent;
    text.textContent = qs('.steps__text', active).textContent;
    stage.style.setProperty('--step', index);
    stops.forEach((stop, k) => stop.classList.toggle('is-reached', k <= index));
    prev.disabled = index === 0;
    next.textContent = index === last ? 'Plan my trip' : 'Next step';
  }

  buttons.forEach((btn) => btn.addEventListener('click', () => go(Number(btn.dataset.step))));
  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => (index === last ? (location.hash = '#contact') : go(index + 1)));

  stage.hidden = false;
  go(0);
}
