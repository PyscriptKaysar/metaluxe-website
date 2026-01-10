# PLANNING — Dad’s Business Website

## Goal
A fast, professional website for a machinery / welding / fabrication business in the UAE.
- Showcase services, products, and past work (projects/photos).
- Make it easy to contact (WhatsApp/call/contact form).
- Rank on Google for relevant UAE searches (SEO).
- Support **multi-language** (English + Arabic).

## Scope (v1 = build now)
- ~20–25 pages total:
  - Home
  - About
  - Services (multiple pages)
  - Products (multiple pages)
  - Projects / Gallery
  - Contact
  - Optional: FAQ / Certifications / Clients
- **SEO included** (titles/descriptions, sitemap, robots, Search Console-ready).
- **Multi-language included** (English + Arabic).
- **Custom forms included** (contact form + basic validation + anti-spam).
- No payments, no ordering system, no user accounts.

## Decisions locked for now (stack)
- Framework: **Astro** (static site, SEO-friendly, fast; supports i18n).
- Hosting: **Cloudflare Pages**.
- Domain: **Porkbun** (Dad owns domain account).
- DNS: **Cloudflare** (Dad owns Cloudflare account).
- Forms backend: **Cloudflare Pages Functions** (simple server endpoint).
- Anti-spam: **Cloudflare Turnstile**.
- Form delivery:
  - v1: send to email provider (Resend/MailerSend/etc) OR store in a simple DB (optional)
  - do not store sensitive data unnecessarily

## Non-negotiables
- Ownership safety:
  - Domain registrar account = Dad
  - Cloudflare account = Dad
  - GitHub repo owner = Dad / business org
  - Developer = collaborator only
- HTTPS must work (no “Not secure” warning).
- Mobile-first and fast loading.
- No secrets in repo. Use `.env` and `.env.example`.

## SEO requirements (v1)
Every page must have:
- Unique **title** + **meta description**
- Correct headings (one H1 per page)
- OpenGraph/Twitter metadata
Also include:
- `sitemap.xml`
- `robots.txt`
- Clear internal links (navbar/footer)
After launch:
- Add Google Search Console + submit sitemap (manual step outside code)

## Multi-language (v1)
- Languages: **en** and **ar**
- URL strategy: `/en/...` and `/ar/...` (or default `en` with `/ar/...`)
- Add language switcher in header
- Ensure RTL layout for Arabic pages
- Keep translations in a single place (JSON/YAML) + per-page content files

## Forms (v1)
- Contact form must:
  - Validate required fields (name, phone/email, message)
  - Include Turnstile verification
  - Rate-limit / basic abuse protection
  - Return clear success/error UI
- Never expose private keys on the client
- Use `.env` for API keys

## Performance rules
- Optimize images (prefer WebP/AVIF).
- Lazy-load gallery images.
- Keep JS light (don’t ship heavy libs unless needed).
- Pass Lighthouse mobile sanity checks.

## Repo structure (recommended)
- `src/pages/` — site pages (including language routes)
- `src/components/` — UI components
- `src/content/` — services/products/projects content
- `functions/` (or framework equivalent) — form endpoint(s)
- `public/` — static assets (images, icons, robots, etc)
- `docs/` — notes/checklists (optional)

## Deployment flow (source of truth)
1) Build site locally
2) Push to GitHub
3) Deploy via Cloudflare Pages
4) Add custom domain (apex + www)
5) Verify HTTPS + redirects
6) Verify forms work + anti-spam works
7) Submit sitemap in Google Search Console

## Future (explicitly NOT in v1 unless added)
- Admin panel / CMS
- Blog (unless requested later)
- CRM pipeline / lead dashboard
- Payments / ordering system
