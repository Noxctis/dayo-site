import { qs } from './lib/dom.js';
import { createStore } from './lib/store.js';
import { readCatalog, DEFAULT_TRAVELERS } from './lib/catalog.js';
import { readContact } from './lib/contact.js';
import { initHeader } from './features/header.js';
import { initHero } from './features/hero.js';
import { initReveal } from './features/reveal.js';
import { initDisclosures } from './features/disclosure.js';
import { initPackages } from './features/packages.js';
import { initSteps } from './features/steps.js';
import { initTripForm } from './features/tripForm.js';

const catalog = readCatalog();
const contact = readContact();
const store = createStore({
  package: qs('input[name="package"]:checked')?.value ?? Object.keys(catalog)[0],
  travelers: DEFAULT_TRAVELERS,
});

initHeader();
initHero();
initReveal();
initDisclosures();
initPackages(store, catalog);
initSteps();
initTripForm(store, catalog, contact);

qs('[data-year]').textContent = new Date().getFullYear();
