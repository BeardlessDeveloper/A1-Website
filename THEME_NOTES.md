# A1 Quality Paralegal WordPress Theme Notes

## Purpose
This file captures the decisions, structure, and content sources used to build the custom WordPress theme in this repository. It is meant to be a living document for future iterations, updates, and handoffs.

## Source References
- Primary reference: `reference_docs/HOME _ A1 Quality Paralegal.html` (Wix export HTML).
- Supporting assets: `reference_docs/HOME _ A1 Quality Paralegal_files/Paraleagal_logo_JPG.jpg` (logo used in theme).

## Confirmed Content Extracted From Reference
The Wix HTML contained usable visible text for the Home page only. The following items were found and used directly or closely paraphrased:
- Site name: "A1 Quality Paralegal"
- Primary message: "We are a family owned and operated business, serving our small town and Oregon since 1995! Providing our community personal, professional and friendly service!"
- CTA labels and navigation labels: "Book an Appointment", "Estate Planning", "Probate", "Property Transfers", "Other Services", "Read More", "Estate Packages"
- Contact block:
  - Address: 327 NE 6th St #1, Grants Pass, OR 97526
  - Phone: 541-474-2260
  - Email: a1qualitydocuments@gmail.com
- Short contact feedback: "Thanks for submitting!"

## Theme Overview
Theme name: A1 Quality Paralegal
Location: `wp-content/themes/a1-quality-paralegal/`
Type: Custom classic theme (not a child theme, not FSE).
Target stack: WordPress 6.9.1, PHP 8.2.30, SiteGround hosting.

## Structure Created
Core theme files:
- `style.css` with theme header (main styles in `assets/css/main.css`).
- `functions.php` for setup, assets, menus, and contact form handling.
- `header.php` + `footer.php` for global layout.
- `index.php` and `page.php` for generic rendering.

Page templates:
- `front-page.php` (Home page)
- `page-estate-planning.php`
- `page-bookings.php`
- `page-contact-us.php`

Assets:
- `assets/css/main.css`
- `assets/js/main.js`
- `assets/images/logo.jpg`

## Design Direction
- Custom typography: Cormorant Garamond (headlines) + Source Sans 3 (body).
- Palette: warm cream/sand background, forest greens, muted gold accents.
- Layout: modern two-column hero with card, service grid, and bold contact CTA band.
- Motion: section reveal animations with graceful fallback for reduced motion.

## Functional Features
- Navigation menus registered: `primary`, `footer`.
- Logo: uses custom logo when set in WP, otherwise falls back to `assets/images/logo.jpg`.
- Contact form:
  - Located on `page-contact-us.php`.
  - Uses `admin-post.php` with nonce and sanitization.
  - Sends email to WordPress `admin_email` via `wp_mail`.
  - Redirects with `?sent=1` or `?error=1`.

## Page Intentions
Home (`front-page.php`):
- Hero: brand intro and core message from reference.
- CTA buttons: "Read More" to Estate Planning, "Book an Appointment" to Bookings.
- Services: four-category grid based on nav labels.
- Contact strip: immediate contact info.

Estate Planning (`page-estate-planning.php`):
- Placeholder package tiers (Essential, Family, Legacy).
- Needs real service copy and pricing if available.

Bookings (`page-bookings.php`):
- Placeholder content and shortcode area for booking plugin.
- Needs selected plugin/shortcode and scheduling rules.

Contact (`page-contact-us.php`):
- Contact form + embedded Google map iframe.
- Uses reference contact information.

## Known Gaps / Needed Inputs
- Estate Planning page copy, package names, and service descriptions.
- Booking provider choice and shortcode (e.g., Calendly, Amelia, Bookly).
- Any additional branding assets (vector logo, colors, photography).
- Preferred legal disclaimers or professional notices.
- Any SEO meta text or structured data.

## Deployment Notes (SiteGround)
- Upload theme folder to `wp-content/themes/` on the SiteGround WordPress install.
- Activate theme in WP Admin.
- Create pages and ensure slugs:
  - `estate-planning`
  - `bookings`
  - `contact-us`
- Set a static front page in Settings -> Reading if needed.
- Create and assign a menu to "Primary Menu".

## Change Log
- 2026-02-21: Initial theme scaffolding, styles, and page templates created.

## Next Steps (Suggested)
- Replace placeholder Estate Planning and Booking content with real copy.
- Configure booking plugin and inject shortcode in Bookings template.
- Add SEO plugin and update page-specific metadata.
- Provide additional images for hero and services.