import { qs } from '../lib/dom.js';

let timer;

export function showToast(message, duration = 2400) {
  const el = qs('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('is-visible'), duration);
}
