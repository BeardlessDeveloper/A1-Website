# Content Update Rules — a1-website

## Updating Page Copy

Page content lives in `src/pages/`. Each page is an `.astro` file:

- `src/pages/index.astro` — home page
- `src/pages/estate-planning.astro` — estate planning services page
- `src/pages/contact-us.astro` — contact page
- `src/pages/bookings.astro` — bookings page
- `src/pages/intake.astro` — web intake form page
- `src/pages/404.astro` — 404 error page

Edit the relevant `.astro` file directly. The shared page wrapper (nav, footer,
head tags) is in `src/layouts/Layout.astro`.

## Updating the Contact Form

`ContactForm.tsx` lives at `src/components/ContactForm.tsx`. It posts to the
`/intake` route on `a1-api`. Update field names, validation, or endpoint URL here.

## Updating Branding Assets

Branding assets (logo, favicon) live in two places:
1. `internal/assets/` — the source of truth (private submodule)
2. `assets/branding/` — a copy in this public repo for reference
3. `public/images/` — where the build script puts them for the live site

To update branding:
1. Update assets in the `internal/` submodule repo directly
2. Commit and push in the submodule
3. Run `git submodule update --remote` in this repo to advance the pointer
4. Run `npm run dev` or `npm run build` — the prebuild script (`scripts/copy-internal-assets.mjs`) copies assets from `internal/assets/` into `public/images/`
5. Commit the submodule pointer update in this repo

## Adding a New Page

1. Create `src/pages/new-page-name.astro`
2. Import and use `Layout.astro` for consistent nav/footer
3. Add a link to the new page in `src/layouts/Layout.astro` nav if needed
4. The page will be available at `/new-page-name/` after build
5. Update `astro.config.mjs` sitemap filter if the page should be excluded from sitemap
6. Document the new page in `docs/copy-manual.md`

## Build and Deploy

```
npm run dev      # local dev server with hot reload
npm run build    # production build → dist/
npm run preview  # preview the dist/ build locally before pushing
```

Deployment is automatic via `.github/workflows/deploy.yml` — push to `main` and
GitHub Actions builds and publishes to GitHub Pages at `a1paralegal.com`.

## Do Not Modify dist/ Directly

`dist/` is build output — gitignored and overwritten on every build. All changes
must go through source files and `npm run build`.
