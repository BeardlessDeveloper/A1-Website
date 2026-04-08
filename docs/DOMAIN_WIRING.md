# Domain Wiring Guide — A1 Quality Paralegal

Domain (`a1paralegal.com`) is registered through **GoDaddy** but DNS is now managed by **Cloudflare**.
GoDaddy nameservers have been updated to point to Cloudflare — propagation may take up to 48 hours.
The `api` subdomain will be created automatically by `cloudflared tunnel route dns` once the tunnel is active.

> **Status:** Custom domain is live at `https://www.a1paralegal.com`. Cloudflare nameservers active and
> propagated. Cloudflare Tunnel active — `api.a1paralegal.com` routes to the Ubuntu server.

---

## Overview of what we are creating

| Subdomain | Points to | Purpose |
|---|---|---|
| `www.a1paralegal.com` | GitHub Pages | The website |
| `a1paralegal.com` (apex) | GitHub Pages | Redirect to www |
| `api.a1paralegal.com` | Cloudflare Tunnel | The Express API server |

The `api` record is created automatically by `cloudflared tunnel route dns` (covered in the Ubuntu setup guide). This guide focuses on wiring `www` and the apex domain to GitHub Pages.

---

## Part 1 — Add your custom domain to GitHub Pages

1. Go to **github.com/BeardlessDeveloper/A1-Website** → Settings → Pages
2. Under **Custom domain**, type `www.a1paralegal.com` and click Save
3. GitHub will attempt to verify the domain. Leave this page open — it will update once DNS propagates.

---

## Part 2 — Create DNS records for GitHub Pages

These records were originally created in GoDaddy and have since been imported into Cloudflare. They are now managed in the Cloudflare DNS dashboard. The `www` CNAME and apex A records should already be present — verify in Cloudflare → DNS → Records.

For the **www CNAME**, set proxy status to **DNS only** (grey cloud) — GitHub Pages handles HTTPS and proxying through Cloudflare can interfere with certificate provisioning.

### www subdomain (CNAME)

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `beardlessdeveloper.github.io` |

### Apex domain (A records)

GitHub Pages requires four A records for the root domain. Add all four:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

These IPs are GitHub's official Pages IPs and do not change.

---

## Part 3 — Wait for DNS propagation

DNS changes take anywhere from a few minutes to 48 hours depending on your registrar.
You can check progress from any terminal:

```bash
# Check www CNAME
dig www.a1paralegal.com CNAME +short
# Should return: beardlessdeveloper.github.io.

# Check apex A records
dig a1paralegal.com A +short
# Should return the four GitHub IPs above
```

---

## Part 4 — Enable HTTPS on GitHub Pages

Once GitHub verifies the domain (the Pages settings page will show a green checkmark):

1. Go to Settings → Pages
2. Check **Enforce HTTPS** — this redirects all `http://` traffic to `https://` automatically

---

## Part 5 — Astro config (already done)

`astro.config.mjs` has been updated. `base: '/A1-Website'` was removed and `site` was set to `https://www.a1paralegal.com`. Do not re-add the `base` field.

---

## Part 6 — Update the API CORS allowlist

In `~/a1-api/.env` on the Ubuntu machine, update `ALLOWED_ORIGINS` to include your custom domain:

```
ALLOWED_ORIGINS=https://www.a1paralegal.com,https://beardlessdeveloper.github.io
```

Then restart the API:

```bash
pm2 restart a1-api
```

---

## Verification checklist

- [x] `https://www.a1paralegal.com` loads the site with a valid SSL padlock
- [ ] `https://a1paralegal.com` redirects to `www`
- [x] `https://api.a1paralegal.com/health` returns `{"ok":true}`
- [ ] Submitting the contact form sends an email to `a1qualitydocuments@gmail.com` (pending Gmail App Password)
- [ ] No browser console errors about CORS or mixed content

> GitHub Pages Settings shows "DNS check unsuccessful" — this is a known intermittent GitHub bug.
> The site is live and functional. If it bothers you, try removing and re-saving the custom domain
> in Settings → Pages, then wait a few minutes before checking again.
