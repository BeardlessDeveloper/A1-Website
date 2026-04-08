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
| React islands | `src/components/` | `ContactForm.tsx` and `IntakeForm.tsx` run in the browser |
| API server | `../A1-API/` | Separate repo/machine — Express + Nodemailer |

The contact form POSTs to `PUBLIC_API_URL/intake` and the client intake form POSTs to `PUBLIC_API_URL/submit-intake` (set in `.env`, never committed). All other pages are fully static.

The site is live at `https://www.a1paralegal.com`. The `base` path has been removed from `astro.config.mjs` — do not re-add it.

## Reference docs

- **Full project context, stack decisions, current state** → [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md)
- **Ubuntu server + Cloudflare Tunnel setup** → [`docs/UBUNTU_SERVER_SETUP.md`](docs/UBUNTU_SERVER_SETUP.md)
- **DNS and domain wiring** → [`docs/DOMAIN_WIRING.md`](docs/DOMAIN_WIRING.md)
