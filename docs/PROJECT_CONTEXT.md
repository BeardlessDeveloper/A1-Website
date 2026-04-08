# Project Context — A1 Quality Paralegal Website

Full context for this build: decisions made, tools chosen, architecture rationale, and current state.

---

## The Business

**A1 Quality Paralegal LLC**
Family-owned legal document preparation service in Grants Pass, Oregon. Operating since 1995.
Not a law firm — they prepare documents to client direction and do not provide legal advice.

| | |
|---|---|
| Address | 327 NE 6th St #1, Grants Pass, OR 97526 |
| Phone | 541-474-2260 |
| Email | a1qualitydocuments@gmail.com |
| Booking | Google Calendar Appointments (embed on /bookings/) |

---

## Origin of This Build

The site previously existed as a Wix site. A custom WordPress theme was built as an intermediate step (targeting SiteGround hosting, WordPress 6.9.1, PHP 8.2). That WordPress theme has since been removed from the repo — the Astro site is the sole active codebase.

The decision was made to migrate off WordPress entirely and rebuild as a static site on GitHub Pages with a self-hosted API backend. The motivations were:
- Eliminate WordPress hosting costs and maintenance overhead
- GitHub Pages is free and Git-native
- The site is mostly content — a full CMS is unnecessary
- Payments and intake forms are future requirements that need a proper backend anyway

---

## Tech Stack

### Frontend

| Tool | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build) | 5.x | Static site framework |
| React | 19.x | Interactive component islands only |
| TypeScript | 5.x | Type safety in components |
| Vanilla CSS | — | All styles in `src/styles/main.css` |
| Google Fonts | — | Cormorant Garamond + Source Sans 3 |

**Hosting:** GitHub Pages (free tier)
**Deploy:** GitHub Actions — push to `master` triggers build and deploy automatically
**Build output:** `dist/` (static HTML/CSS/JS, never committed)

### Backend (API Server)

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 20 LTS | Runtime |
| Express | 4.x | HTTP server and routing |
| Nodemailer | 8.x | SMTP email dispatch |
| CORS | 2.x | Origin allowlist for GitHub Pages domain |
| PM2 | latest | Process management and auto-restart |

**Hosting:** Ubuntu machine at the business office
**Tunnel:** Cloudflare Tunnel (`cloudflared`) — exposes the server without a static IP or open firewall ports
**Repo:** `A1-API/` (separate directory from this frontend repo)

### Infrastructure

| Component | Tool | Notes |
|---|---|---|
| DNS / CDN | Cloudflare | Manages domain, issues tunnel CNAME |
| Tunnel | Cloudflare Tunnel | `api.a1paralegal.com` → `localhost:3001` |
| SSL (frontend) | GitHub Pages / Let's Encrypt | Automatic |
| SSL (API) | Cloudflare Tunnel | Automatic — no cert management needed |
| Email (SMTP) | Gmail + App Password | Sends intake notifications to business email |

---

## Architecture Decisions

### Why Astro over Jekyll or Next.js
Jekyll was rejected because it uses Ruby and Liquid templating — less familiar, harder to extend. Next.js was rejected because the site has no need for server-side rendering or a React-heavy architecture. Astro ships zero JS by default and allows React to be used only where interactivity is actually needed (the contact form). It also has first-class GitHub Pages support via its static output mode.

### Why a self-hosted API instead of Vercel/Netlify
The business already owns Ubuntu hardware at the office. Running a lightweight Node process on existing hardware costs nothing. Cloudflare Tunnel eliminates the need for a static IP or port forwarding — the server dials out to Cloudflare, so no ISP configuration is needed. Future requirements (payments, data storage, intake processing) are all easier to control on owned infrastructure than on a managed platform with per-invocation billing.

### Why GitHub Pages instead of Vercel/Netlify for the frontend
The dynamic features (form submission, future payments) are handled server-side on the Ubuntu machine. The frontend is genuinely static. GitHub Pages is free, reliable, and integrates directly with the existing GitHub repo.

### Why the API is a separate repo
The frontend is public on GitHub Pages (the repo must be public for free Pages hosting). The API server contains SMTP credentials and will eventually contain payment keys. Keeping it in a separate, private repo ensures no secrets can accidentally be committed to the public frontend repo.

### Why vanilla CSS instead of Tailwind or a component library
The design was already built in the WordPress theme. The CSS was ported directly and is clean, well-organized, and uses CSS custom properties for the design system. Adding a framework would add complexity with no benefit at this scale.

### Astro Islands (client:load)
Only `ContactForm.tsx` uses `client:load`. Everything else is server-rendered at build time. This keeps the page payload minimal — the React runtime is only loaded on the Contact page.

---

## Design System

Defined in `src/styles/main.css` as CSS custom properties:

| Token | Value | Usage |
|---|---|---|
| `--forest` | `#1e3a8a` | Primary buttons, headings, accents |
| `--gold` | `#b91c1c` | Secondary button, price labels |
| `--ink` | `#111827` | Body text |
| `--cream` | `#ffffff` | Backgrounds |
| `--sand` | `#f3f4f6` | Section backgrounds |

**Typography:** Cormorant Garamond for headings, Source Sans 3 for body (Google Fonts)
**Motion:** CSS `@keyframes revealFade` on `.reveal` class, `prefers-reduced-motion` respected

---

## Pages and Routes

| Route | Source file | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero, mission, services grid, testimonial, contact CTA |
| `/estate-planning/` | `src/pages/estate-planning.astro` | Package tiers with real pricing |
| `/bookings/` | `src/pages/bookings.astro` | Google Calendar Appointments embed |
| `/contact-us/` | `src/pages/contact-us.astro` | React form island + Google Maps embed |

---

## API Endpoints

Base URL configured via `PUBLIC_API_URL` in `.env`.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/intake` | Contact form submission → email notification |
| `GET` | `/health` | Health check for monitoring |

The `/intake` route validates name, email, message; sanitizes all input; sends email via Nodemailer to `NOTIFY_EMAIL`. CORS is restricted to `ALLOWED_ORIGINS` (the GitHub Pages domain and custom domain).

---

## Environment Variables

### Frontend (`A1-Website/.env` — not committed)

| Variable | Purpose |
|---|---|
| `PUBLIC_API_URL` | Base URL of the Express API server |

### Backend (`A1-API/.env` — not committed, lives only on the server)

| Variable | Purpose |
|---|---|
| `PORT` | Port Express listens on (default 3001) |
| `ALLOWED_ORIGINS` | Comma-separated CORS allowlist |
| `SMTP_HOST` | SMTP server (smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (587) |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password |
| `NOTIFY_EMAIL` | Where intake emails are delivered |

---

## Deployment Flow

```
Developer pushes to master
        ↓
GitHub Actions runs (deploy.yml)
        ↓
  npm ci → astro build
        ↓
  dist/ uploaded to GitHub Pages
        ↓
Site live at beardlessdeveloper.github.io/A1-Website/
(or custom domain once DNS is wired)
```

API server updates are manual:
```
git pull on Ubuntu machine → pm2 restart a1-api
```

---

## Current State (as of April 2026)

- [x] Astro frontend built and deployed to GitHub Pages
- [x] All four pages ported and polished (Home, Estate Planning, Bookings, Contact)
- [x] 404 page added
- [x] React contact form wired to API endpoint
- [x] Express API server scaffolded with email handler
- [x] A1-API repo created at github.com/BeardlessDeveloper/A1-API (private)
- [x] PM2 and Cloudflare Tunnel instructions documented
- [x] WordPress PHP files and legacy assets removed from repo
- [x] UI/UX overhaul — Cormorant Garamond/Source Sans 3 typography, mobile hamburger nav, active nav links, IntersectionObserver scroll reveals, clickable contact info throughout
- [x] Domain updated to a1paralegal.com across all config and docs
- [ ] Custom domain not yet wired (DNS records pending — see `docs/DOMAIN_WIRING.md`)
- [ ] `astro.config.mjs` base path not yet updated for custom domain
- [ ] Ubuntu server not yet provisioned (pending `docs/UBUNTU_SERVER_SETUP.md`)
- [ ] Gmail App Password not yet configured
- [ ] Payments not yet implemented

---

## Known Content Gaps

These need real inputs before the site is complete:
- Additional photography (hero image, service section images)
- Vector or high-res logo file
- Legal disclaimers or professional notices beyond the current footer text
- SEO metadata (page descriptions are placeholders)

---

## Related Documentation

- [`docs/UBUNTU_SERVER_SETUP.md`](UBUNTU_SERVER_SETUP.md) — step-by-step Ubuntu + Cloudflare Tunnel setup
- [`docs/DOMAIN_WIRING.md`](DOMAIN_WIRING.md) — DNS records and custom domain wiring (a1paralegal.com)
