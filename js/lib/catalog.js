import { qsa } from './dom.js';

export const MIN_TRAVELERS = 1;
export const MAX_TRAVELERS = 20;
export const DEFAULT_TRAVELERS = 2;

/**
 * Package data lives in the markup (data-package / data-name / data-price on each card),
 * so prices are defined once and work without JavaScript.
 * @returns {Record<string, {id: string, name: string, price: number}>}
 */
export function readCatalog() {
  return Object.fromEntries(
    qsa('[data-package]').map((el) => {
      const { package: id, name, price } = el.dataset;
      return [id, { id, name, price: Number(price) }];
    }),
  );
}
