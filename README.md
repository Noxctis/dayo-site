# Dayo Travel and Tours

Static marketing site. Plain HTML, CSS and ES modules. **No build step, no dependencies.**

```
index.html            semantic markup; the single source of truth for content, prices and contact links
css/styles.css        mobile-first, cascade layers, design tokens in :root
js/boot.js            adds the `js` class before paint (progressive enhancement)
js/main.js            entry point; wires features together
js/lib/               dom helpers, store, formatting, catalog + contact readers
js/features/          header, hero, reveal, disclosure, packages, steps, tripForm, toast
img/                  optimised WebP artwork + sprite.svg (icons)
fonts/                self-hosted variable fonts (Bricolage Grotesque, Figtree), SIL OFL
vercel.json           security headers (CSP etc.) and cache policy
```

## Develop

```bash
npm run dev      # serves http://localhost:3000
```

ES modules need an HTTP server; opening `index.html` via `file://` will not run the scripts.

## Edit content

| Change                          | Where                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| Package price / name            | `data-price` / `data-name` on the `.card` in `index.html` (+ the compare table + prices shown on the card) |
| Phone, email, Instagram, Facebook | `<ul class="channels">` in `index.html` (the form reads phone/email from here) and the JSON-LD block in `<head>` |
| Traveler limits                 | `js/lib/catalog.js` (and `min`/`max` on `#f-pax`)                                       |

## Deploy (Vercel)

Import the repo in Vercel. Framework preset: **Other**. Leave build command and output directory empty.
Every push to the default branch deploys. `vercel.json` applies the headers.

The CSP is strict (`script-src 'self'`, no inline scripts or styles). If you add a third-party script
(analytics, chat widget, etc.), allow its origin in `vercel.json`.

## Before going live

- Add `<link rel="canonical">` and an absolute `og:image` once the domain is known.
- Confirm the Facebook and Instagram URLs.
- Run a Lighthouse pass on the deployed URL.
