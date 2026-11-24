import { qs } from './dom.js';

/** Contact details are read from the contact list in index.html (single source of truth). */
export function readContact() {
  const phoneHref = qs('[data-contact="phone"]')?.getAttribute('href') ?? '';
  const emailHref = qs('[data-contact="email"]')?.getAttribute('href') ?? '';
  return {
    phone: phoneHref.replace(/^tel:/, ''),
    email: emailHref.replace(/^mailto:/, ''),
  };
}
