# Domain Wiring Guide — A1 Quality Paralegal

This guide assumes your domain (`a1qualityparalegal.com`) is managed through Cloudflare DNS.
If your domain registrar is not Cloudflare, the records are the same — just enter them
wherever your DNS is managed.

---

## Overview of what we are creating

| Subdomain | Points to | Purpose |
|---|---|---|
| `www.a1qualityparalegal.com` | GitHub Pages | The website |
| `a1qualityparalegal.com` (apex) | GitHub Pages | Redirect to www |
| `api.a1qualityparalegal.com` | Cloudflare Tunnel | The Express API server |

The `api` record is created automatically by `cloudflared tunnel route dns` (covered in the Ubuntu setup guide). This guide focuses on wiring `www` and the apex domain to GitHub Pages.

---

## Part 1 — Add your custom domain to GitHub Pages

1. Go to **github.com/BeardlessDeveloper/A1-Website** → Settings → Pages
2. Under **Custom domain**, type `www.a1qualityparalegal.com` and click Save
3. GitHub will attempt to verify the domain. Leave this page open — it will update once DNS propagates.

---

## Part 2 — Create DNS records for GitHub Pages

Log into Cloudflare (or your DNS provider) and add these records:

### www subdomain (CNAME)

| Type | Name | Content | Proxy status |
|---|---|---|---|
| CNAME | `www` | `beardlessdeveloper.github.io` | **DNS only** (grey cloud) |

> Set proxy to **DNS only** — GitHub Pages handles HTTPS itself. Proxying through Cloudflare
> can interfere with GitHub's certificate provisioning.

### Apex domain (A records)

GitHub Pages requires four A records for the root domain. Add all four:

| Type | Name | Content | Proxy status |
|---|---|---|---|
| A | `@` | `185.199.108.153` | DNS only |
| A | `@` | `185.199.109.153` | DNS only |
| A | `@` | `185.199.110.153` | DNS only |
| A | `@` | `185.199.111.153` | DNS only |

These IPs are GitHub's official Pages IPs and do not change.

---

## Part 3 — Wait for DNS propagation

DNS changes take anywhere from a few minutes to 48 hours depending on your registrar.
You can check progress from any terminal:

```bash
# Check www CNAME
dig www.a1qualityparalegal.com CNAME +short
# Should return: beardlessdeveloper.github.io.

# Check apex A records
dig a1qualityparalegal.com A +short
# Should return the four GitHub IPs above
```

---

## Part 4 — Enable HTTPS on GitHub Pages

Once GitHub verifies the domain (the Pages settings page will show a green checkmark):

1. Go to Settings → Pages
2. Check **Enforce HTTPS** — this redirects all `http://` traffic to `https://` automatically

---

## Part 5 — Update the Astro config for your custom domain

Once your custom domain is live, the Astro `base` path is no longer needed. Update the frontend:

In **`astro.config.mjs`**, change:

```js
// Before (GitHub Pages subdirectory)
export default defineConfig({
  site: 'https://beardlessdeveloper.github.io',
  base: '/A1-Website',
  ...
});
```

```js
// After (custom domain, root path)
export default defineConfig({
  site: 'https://www.a1qualityparalegal.com',
  // base is removed — site lives at the root
  ...
});
```

Then commit and push — the GitHub Actions workflow will rebuild and redeploy automatically.

---

## Part 6 — Update the API CORS allowlist

In `~/a1-api/.env` on the Ubuntu machine, update `ALLOWED_ORIGINS` to include your custom domain:

```
ALLOWED_ORIGINS=https://www.a1qualityparalegal.com,https://beardlessdeveloper.github.io
```

Then restart the API:

```bash
pm2 restart a1-api
```

---

## Verification checklist

- [ ] `https://www.a1qualityparalegal.com` loads the site with a valid SSL padlock
- [ ] `https://a1qualityparalegal.com` redirects to `www`
- [ ] `https://api.a1qualityparalegal.com/health` returns `{"ok":true}`
- [ ] Submitting the contact form sends an email to `a1qualitydocuments@gmail.com`
- [ ] No browser console errors about CORS or mixed content
