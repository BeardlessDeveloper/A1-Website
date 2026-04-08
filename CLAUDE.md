# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the website for **A1 Quality Paralegal**, a family-owned legal document preparation business in Grants Pass, Oregon (est. 1995). The site is being **migrated from a custom WordPress theme to a static site hosted on GitHub Pages**.

The WordPress theme source lives here as the canonical content and design reference. All page copy, structure, and design decisions from the PHP templates should be preserved in the static rebuild.

## Business Content (Source of Truth)

- **Business name:** A1 Quality Paralegal
- **Tagline:** "Helping You, Help Yourself"
- **Address:** 327 NE 6th St #1, Grants Pass, OR 97526
- **Phone:** 541-474-2260
- **Email:** a1qualitydocuments@gmail.com
- **Core message:** Family owned and operated since 1995, personal/professional/friendly service for legal document preparation.

## Pages

| Page | WordPress file | Purpose |
|---|---|---|
| Home | `front-page.php` | Hero, mission, services grid, testimonial, contact CTA |
| Estate Planning | `page-estate-planning.php` | Package tiers (Essential, Family, Legacy) — placeholder content |
| Bookings | `page-bookings.php` | Appointment scheduling — placeholder, needs booking provider |
| Contact | `page-contact-us.php` | Contact form + Google Maps embed |

## Design System

- **Typography:** Cormorant Garamond (headlines) + Source Sans 3 (body) — loaded from Google Fonts
- **Palette:** Warm cream/sand background, forest greens, muted gold accents
- **Layout:** Two-column hero with card, service grid, contact CTA band
- **Motion:** Section reveal animations with `prefers-reduced-motion` fallback (`.reveal` class + IntersectionObserver in `assets/js/main.js`)
- **Button variants:** `.btn--primary`, `.btn--ghost`, `.btn--secondary`

## Asset Structure

```
assets/
  css/main.css     ← all styles
  js/main.js       ← reveal animations
  images/logo.jpg  ← fallback logo (PNG preferred: logo.png)
```

## WordPress → Static Migration Notes

- The contact form in `page-contact-us.php` uses `admin-post.php` + `wp_mail` — this must be replaced with a static-compatible form service (e.g., Formspree, Netlify Forms, EmailJS).
- Navigation menus registered as `primary` and `footer` — recreate in the static template layer.
- Logo logic in `functions.php:a1qp_logo_html()` falls back to `assets/images/logo.png` if no WP custom logo is set — use that fallback path directly in the static build.
- PHP `home_url()` calls for internal links should become relative paths or the static framework's routing mechanism.

## Known Content Gaps

These need real inputs before the site is production-ready:
- Estate Planning: actual package names, descriptions, and pricing
- Bookings: chosen booking provider and embed code (Calendly, Amelia, etc.)
- Additional photos for hero and services sections
- Vector/high-res logo asset
