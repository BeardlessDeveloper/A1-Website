# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static Astro website for **A1 Quality Paralegal** (Grants Pass, OR), deployed to GitHub Pages. A separate Express API server handles form submissions — see `docs/` for setup.

## Commands

```bash
npm run dev      # local dev server at localhost:4321
npm run build    # production build → dist/
npm run preview  # preview the built output
```

## Architecture

| Layer | Location | Notes |
|---|---|---|
| Frontend | `src/` | Astro static site, deploys via GitHub Actions |
| Styles | `src/styles/main.css` | Single CSS file, all design tokens and layout |
| React islands | `src/components/` | Only `ContactForm.tsx` runs in the browser |
| API server | `../A1-API/` | Separate repo/machine — Express + Nodemailer |

The contact form POSTs to `PUBLIC_API_URL/intake` (set in `.env`, never committed). All other pages are fully static.

When a custom domain is live, remove `base: '/A1-Website'` from `astro.config.mjs` and update `site`.

## Reference docs

- **Full project context, stack decisions, current state** → [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
- **Content, copy, and design decisions** → [`THEME_NOTES.md`](THEME_NOTES.md)
- **Ubuntu server + Cloudflare Tunnel setup** → [`docs/UBUNTU_SERVER_SETUP.md`](docs/UBUNTU_SERVER_SETUP.md)
- **DNS and domain wiring** → [`docs/DOMAIN_WIRING.md`](docs/DOMAIN_WIRING.md)
