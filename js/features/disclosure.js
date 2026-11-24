import { qsa } from '../lib/dom.js';

/**
 * Accessible show/hide: <button data-disclosure aria-controls="id" aria-expanded>.
 * The collapsed panel is `inert` so its content leaves the tab order and the accessibility tree.
 * Optional data-label-open / data-label-closed swap the button text.
 */
export function initDisclosures() {
  qsa('[data-disclosure]').forEach((button) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    const set = (open) => {
      button.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      panel.inert = !open;
      const label = open ? button.dataset.labelOpen : button.dataset.labelClosed;
      if (label) button.textContent = label;
    };

    set(false);
    button.addEventListener('click', () => set(button.getAttribute('aria-expanded') !== 'true'));
  });
}
