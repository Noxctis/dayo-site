import { qs, clamp } from '../lib/dom.js';
import { formatPeso, formatDate } from '../lib/format.js';
import { MIN_TRAVELERS, MAX_TRAVELERS } from '../lib/catalog.js';
import { showToast } from './toast.js';

const today = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time

/** Trip request form -> a pre-filled message the visitor can email, text or copy. */
export function initTripForm(store, catalog, contact) {
  const form = qs('#trip-form');
  if (!form) return;

  const els = {
    from: qs('#f-from'),
    to: qs('#f-to'),
    pax: qs('#f-pax'),
    pkg: qs('#f-pkg'),
    out: qs('[data-output]'),
    text: qs('[data-output-text]'),
    mail: qs('[data-output-mail]'),
    sms: qs('[data-output-sms]'),
    copy: qs('[data-output-copy]'),
  };

  // Show prices in the package <select>, from the same catalog the cards use.
  [...els.pkg.options].forEach((option) => {
    const pkg = catalog[option.value];
    if (pkg) option.textContent = `${pkg.name.split(' ')[0]} · ${formatPeso(pkg.price)}`;
  });

  // Dates: no past departures; return date must not be before departure.
  // We never rewrite what the visitor typed, we only report a clear validation message.
  els.from.min = els.to.min = today();
  const checkDates = () => {
    const { value: from } = els.from;
    const { value: to } = els.to;
    els.to.setCustomValidity(from && to && to < from ? 'The return date can’t be before the departure date.' : '');
  };
  els.from.addEventListener('input', checkDates);
  els.to.addEventListener('input', checkDates);

  // Keep form fields and the package section in sync through the store.
  els.pkg.addEventListener('change', () => store.set({ package: els.pkg.value }));
  els.pax.addEventListener('input', () => {
    const n = Math.round(Number(els.pax.value));
    if (Number.isFinite(n) && n >= MIN_TRAVELERS) store.set({ travelers: clamp(n, MIN_TRAVELERS, MAX_TRAVELERS) });
  });
  store.subscribe(({ package: id, travelers }) => {
    if (els.pkg.value !== id) els.pkg.value = id;
    if (Number(els.pax.value) !== travelers) els.pax.value = travelers;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    checkDates();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const value = (key) => String(data.get(key) ?? '').trim();
    const pkg = catalog[value('package')];
    const travelers = Number(value('travelers'));
    const dates = value('departure') || value('return')
      ? `${formatDate(value('departure')) || '—'} to ${formatDate(value('return')) || '—'}`
      : 'Flexible';

    const lines = [
      "Hi Dayo Travel and Tours! I'd like to plan a trip.",
      '',
      `Name: ${value('name') || '—'}`,
      `Destination: ${value('destination') || 'Open to suggestions'}`,
      `Dates: ${dates}`,
      `Travelers: ${travelers}`,
      `Package: ${pkg ? `${pkg.name} (${formatPeso(pkg.price)} / person)` : 'Fully custom trip'}`,
    ];
    if (pkg) lines.push(`Estimate: ${formatPeso(pkg.price * travelers)} total`);
    if (value('notes')) lines.push('', `Notes: ${value('notes')}`);
    const message = lines.join('\n');

    els.text.textContent = message;
    els.mail.href = `mailto:${contact.email}?subject=${encodeURIComponent('Trip request — Dayo Travel and Tours')}&body=${encodeURIComponent(message)}`;
    els.sms.href = `sms:${contact.phone}?&body=${encodeURIComponent(message)}`;
    els.out.hidden = false;
    els.out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  els.copy.addEventListener('click', async () => {
    const message = els.text.textContent;
    try {
      await navigator.clipboard.writeText(message);
      showToast('Copied. Paste it to Dayo.');
    } catch {
      const range = document.createRange();
      range.selectNodeContents(els.text);
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      showToast('Press Ctrl+C / ⌘C to copy the selected text.');
    }
  });
}
