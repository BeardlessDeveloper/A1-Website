# a1-website

## What This Repo Is

Astro + React public marketing site for A1 Paralegal deployed to a1paralegal.com
via GitHub Pages. Six pages plus a contact form wired to a1-api. Private content
(branding, internal docs, IntakeForm component) lives in the `internal/` git
submodule — do not move submodule content into the public repo.

## This agent does NOT:
- Commit or push anything from `dist/` — built output, gitignored
- Modify files inside `internal/` directly — that is a separate private repo
- Add client data or form submissions to this repo
- Change the GitHub Pages deployment target without coordinating DNS

## Quick Start

npm run dev        # local development server
npm run build      # production build to dist/
npm run preview    # preview production build locally

## Submodule Note

`internal/` is a git submodule pointing to the private `a1-website-internal` repo.
To update internal content: make changes in the submodule repo, commit there,
then run `git submodule update --remote` here and commit the pointer update.
To initialize after a fresh clone: `git submodule update --init --recursive`

## Skill Files — load on demand

| Task | File |
|---|---|
| Content updates, new pages, branding | `instructions/content-update-rules.md` |
| Deployment, domain, server setup | `docs/ubuntu-server-setup.md` |
| Domain wiring and DNS | `docs/domain-wiring.md` |
| Copy and content guidelines | `docs/copy-manual.md` |
| SEO audit history | `docs/seo-audit-2026-04-28.md` |

## Dependency Policy
- Before installing any new package, library, or tool — stop and tell KC what is needed and why
- Format the notification as:
  ```
  DEPENDENCY NEEDED: <package-name>
  Reason: <one sentence why it is required>
  Command: <exact install command>
  Proceed? (yes/no)
  ```
- Only install after receiving explicit confirmation
- After installing, add the dependency to the appropriate file:
  - Node packages → `package.json` (via `npm install --save` or `--save-dev`)
  - Python packages → `requirements.txt` (create if it doesn't exist)
  - PowerShell modules → note in `docs/` or `README.md`
- Commit the updated dependency file immediately after installation:
  `chore: add <package-name> dependency — <reason>`
- Never install global packages without explicit KC approval
