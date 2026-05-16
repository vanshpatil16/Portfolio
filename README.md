# Vansh Patil — Portfolio

Personal portfolio for Vansh Patil (ML engineer & researcher).
Frontend ported pixel-perfectly from the Claude Design handoff bundle.
Backend wired with Next.js App Router on Vercel Fluid Compute.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Plain CSS (design-source verbatim) — no Tailwind, no design system
- Resend for transactional email (optional; falls back to log)
- Deploys to Vercel Fluid Compute (Node 24)

## Quickstart

```bash
npm install
cp .env.local.example .env.local   # optional — wire Resend
npm run dev                        # http://localhost:3000
```

## Backend routes

| Route          | Method | Purpose                                                |
| -------------- | ------ | ------------------------------------------------------ |
| `/api/contact` | POST   | Contact form. Honeypot + rate-limit + Resend delivery. |
| `/api/contact` | GET    | Endpoint description (for clients).                    |
| `/api/health`  | GET    | Liveness probe / build metadata.                       |
| `/resume.pdf`  | GET    | Résumé download (static, served from `public/`).       |

### Contact body

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "subject": "Research collab",
  "message": "Hey Vansh, …",
  "website": ""
}
```

`website` is a honeypot. Leave it empty.

## Environment variables

All optional — the form works without them (messages are persisted to `/tmp/contact-log.jsonl`
on Vercel or `.data/contact-log.jsonl` locally, and a "stored locally" note is returned).

| Variable             | Purpose                                              |
| -------------------- | ---------------------------------------------------- |
| `RESEND_API_KEY`     | Resend API key — enables email delivery.             |
| `CONTACT_TO_EMAIL`   | Where messages land (e.g. `patilvansh822@gmail.com`).|
| `CONTACT_FROM_EMAIL` | Verified sender (e.g. `portfolio@vanshpatil.dev`).   |

## Notable features (frontend)

- Dark editorial-terminal aesthetic, chartreuse accent
- Live IST clock + custom cursor + grain overlay
- Scroll-driven timeline fills (experience + achievements)
- Periodic-table skills grid with filter chips + auto-cycling readout
- Brand-logo swap on cell hover (Simple Icons CDN)
- Flippable achievement flashcards
- ⌘K command palette
- Tweaks panel (bottom-right): accent / display font / project layout / grain / cursor

## Project layout

```
app/
  layout.tsx        # html shell + fonts
  page.tsx          # full single-page portfolio
  globals.css       # design CSS, verbatim from source
  api/
    contact/route.ts
    health/route.ts
  robots.ts
  sitemap.ts
components/
  ClientRuntime.tsx # all interactive logic (clock, cursor, IO, cmdK, …)
  ContactForm.tsx
  ProjectThumb.tsx
lib/
  content.ts        # all portfolio data
public/
  assets/avatar.jpg
  resume.pdf
```

## Deploy

```bash
vercel deploy
```

Defaults to Fluid Compute (Node 24, 300s timeout). No `vercel.json` needed.
