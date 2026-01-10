# Copilot Instructions — Dad’s Business Website

## Non-negotiables
- **Read `PLANNING.md` + `TASK.md` first** at the start of any new chat/work session.
- **One step at a time.** If I ask for multiple things, make me pick one.
- **Do not code until I say “go”.** First propose the smallest change + plan.
- **No secrets in code.** Never paste API keys. Use `.env` + `.env.example`.
- **Keep it simple + fast.** This is a business site (mostly static pages).
- **Don’t invent business facts.** If content/details are missing, ask 1–3 questions and stop.

## Project goals (default assumptions)
- SEO-friendly site (titles, meta descriptions, OG tags).
- 20–25 pages (services, products, gallery/projects, about, contact).
- Optional: custom contact forms (anti-spam + email send).
- Mobile-first, fast load, clean UI.

## Docs-first research order (enforced)
1) Repo docs: `PLANNING.md`, `TASK.md`, `README.md`
2) If available: **Context7 MCP** / official framework docs
3) Only if still unclear: web search / general knowledge
- If you couldn’t find it, ask me and i can find it for u.

## How to work (workflow)
- Before coding: propose **the smallest change** that completes the current task.
- If info is missing: ask **1–3 specific questions** and wait.
- After coding: summarize:
  - **What I did**
  - **Files changed**
  - **How to test**
  - **Notes / risks**

## Architecture rules (keep it clean)
- Prefer **static pages** and lightweight components.
- Avoid heavy libraries unless needed.
- Keep files small: target **<500 LOC/file** (700 only if unavoidable).
- Split by feature: `pages/`, `components/`, `lib/`, `content/` (or equivalent).

## SEO rules (must follow)
- Every page must have:
  - Unique **title**
  - Unique **meta description**
  - Correct **canonical** (if used)
  - OpenGraph/Twitter metadata for sharing
- Add/maintain:
  - `sitemap.xml`
  - `robots.txt`
- No keyword stuffing. Write natural service/location wording.

## Performance rules (must follow)
- **Images:** compress + prefer WebP/AVIF when possible.
- Lazy-load big images. Don’t ship massive hero images.
- Avoid loading large JS on pages that don’t need it.
- Keep Lighthouse mobile performance in mind.

## Forms rules (if we do custom forms)
- Protect against spam:
  - Use **Turnstile** or equivalent
  - Validate inputs server-side too
- Never expose private keys on the client.
- If emailing submissions, use a provider (Resend/MailerSend/etc) via server function.
- Always return clear success/error messages.

## Safety / quality
- Prefer explicit error handling (don’t silently fail).
- Add short comments for non-obvious decisions: `# Reason: ...`
- Keep dependencies minimal and reputable.

## Tasks
- `TASK.md` is the source of truth.
- When finishing a task:
  - Mark status in `TASK.md` (todo → doing → review → done)
  - Note what changed and any follow-ups.

## Output format (use when helpful)
### Plan
- ...
### What I did
- ...
### Files changed
- ...
### How to test
- ...
### Notes / risks
- ...
