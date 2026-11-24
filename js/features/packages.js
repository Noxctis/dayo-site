import { qs, qsa, clamp } from '../lib/dom.js';
import { formatPeso } from '../lib/format.js';
import { MIN_TRAVELERS, MAX_TRAVELERS } from '../lib/catalog.js';

/** Package picker, traveler stepper and live estimate. Reads/writes the shared store. */
export function initPackages(store, catalog) {
  const output = qs('[data-travelers-output]');
  const total = qs('[data-estimate-total]');
  const note = qs('[data-estimate-note]');
  const minus = qs('[data-travelers="-1"]');
  const plus = qs('[data-travelers="1"]');

  qsa('input[name="package"]').forEach((input) =>
    input.addEventListener('change', () => input.checked && store.set({ package: input.value })),
  );

  [minus, plus].forEach((btn) =>
    btn.addEventListener('click', () => {
      const next = store.get().travelers + Number(btn.dataset.travelers);
      store.set({ travelers: clamp(next, MIN_TRAVELERS, MAX_TRAVELERS) });
    }),
  );

  store.subscribe(({ package: id, travelers }) => {
    const pkg = catalog[id];
    if (!pkg) return; // "custom" has no fixed price

    qsa('input[name="package"]').forEach((input) => (input.checked = input.value === id));
    output.textContent = travelers;
    minus.disabled = travelers <= MIN_TRAVELERS;
    plus.disabled = travelers >= MAX_TRAVELERS;
    total.textContent = formatPeso(pkg.price * travelers);
    note.textContent = `${pkg.name} × ${travelers} traveler${travelers === 1 ? '' : 's'} · ${formatPeso(pkg.price)} each`;
  });
}
