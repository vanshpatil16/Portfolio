# Vansh Patil — Portfolio

A single-page personal portfolio for Vansh Patil (ML engineer & researcher), built on Next.js 15
App Router with React 19 and TypeScript. Aesthetic: dark editorial-terminal with a chartreuse
accent — Instrument Serif display, JetBrains Mono UI chrome, Geist body. Deployed to Vercel's
Fluid Compute platform.

> Live: **https://vanshpatil.dev**

---

## Table of contents

1. [What this is](#what-this-is)
2. [Design system](#design-system)
3. [Stack & rationale (the "why")](#stack--rationale-the-why)
4. [Project layout (the "where")](#project-layout-the-where)
5. [How it runs at runtime](#how-it-runs-at-runtime)
6. [Page anatomy (section-by-section)](#page-anatomy-section-by-section)
7. [Mobile responsive pass](#mobile-responsive-pass)
8. [Backend routes](#backend-routes)
9. [Data sources — how content is authored](#data-sources--how-content-is-authored)
10. [Achievements system (auto-discovery)](#achievements-system-auto-discovery)
11. [Contact form & email delivery](#contact-form--email-delivery)
12. [Environment variables](#environment-variables)
13. [Performance & accessibility](#performance--accessibility)
14. [Quickstart & scripts](#quickstart--scripts)
15. [Deployment (Vercel)](#deployment-vercel)
16. [Adding / editing content (cookbook)](#adding--editing-content-cookbook)
17. [Tweaks panel & ⌘K palette](#tweaks-panel--k-palette)
18. [Troubleshooting](#troubleshooting)
19. [Conventions & coding style](#conventions--coding-style)
20. [Roadmap](#roadmap)

---

## What this is

A portfolio that's intentionally over-built — every section has small, deliberate animation;
the design is dense; every detail is custom rather than templated. The visual language was first
prototyped in a static design source (`_design.tar.gz`, kept locally for reference) and then ported
to Next.js so the marketing surface and the backend (contact form, achievements API, etc.) live
in a single deployable.

**What it includes:**

- Hero with 3D-tilt portrait, neural-particle canvas backdrop, IST clock
- Editorial timeline for experience (scroll-driven accent fill)
- Project showcase with hand-drawn SVG thumbs (cards mode) or list mode
- "Periodic table" of 41 skills across 6 categories, with filter chips, brand-logo hover swap, and auto-cycling readout
- Photo-led achievements grid with cursor-tracked spotlight, click-to-cycle gallery, fullscreen lightbox with autoplay
- Contact form wired to Resend with honeypot + per-IP rate limiting + local JSONL fallback
- ⌘K command palette (sections + external links + tweaks)
- Tweaks panel (accent / display font / projects layout / grain / cursor)
- Custom cursor (replaced with native cursor on touch), grain overlay, side-rail with sliding active indicator
- **Mobile drawer nav** with staggered slide-in, sync'd active state, body-scroll lock
- Skip-link, semantic landmarks, keyboard navigation, `prefers-reduced-motion` fallbacks throughout

---

## Design system

> The visual language was authored before the code. The code's job is to render it pixel-for-pixel.

| Token            | Value                                                             |
| ---------------- | ----------------------------------------------------------------- |
| `--bg`           | `#0a0a0a` (page background — deep neutral, not pure black)        |
| `--bg-elev`      | `#111111` (cards, raised surfaces)                                |
| `--bg-card`      | `#141414` (interior nested surfaces)                              |
| `--border`       | `#1f1f1f` (default 1px divider)                                   |
| `--border-strong`| `#2a2a2a` (active / hover)                                        |
| `--fg`           | `#f2f2ef` (warm off-white body)                                   |
| `--fg-muted`     | `#8a8a85`                                                         |
| `--fg-dim`       | `#5a5a55`                                                         |
| `--accent`       | `oklch(0.88 0.18 120)` — chartreuse (swappable: amber/cyan/coral/violet) |

**Type:**

| Family             | Font                                | Use                                                       |
| ------------------ | ----------------------------------- | --------------------------------------------------------- |
| `--serif`          | Instrument Serif (italic enabled)   | Hero/section titles, project & achievement names          |
| `--sans`           | Geist (300–700)                     | Body text, fallback display when `data-display="sans"`    |
| `--mono`           | JetBrains Mono (300–500)            | All chrome — labels, timestamps, metric pills, code-like  |

Fonts are loaded from Google Fonts with `<link rel="preconnect">` and a single CSS request in
`app/layout.tsx` (the only `<head>` block we need).

**Motion language:**

- Cubic-bezier `(.2, .8, .2, 1)` is the default ease curve everywhere
- Reveal animations triggered by `IntersectionObserver` (`reveal.in` toggle)
- Scroll-driven timeline fill on `.exp-list` and `.achv-rowset` (recomputed on scroll/resize)
- All animations guarded by `@media (prefers-reduced-motion: no-preference)` / `reduce` blocks

---

## Stack & rationale (the "why")

| Choice                              | Why                                                                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Next.js 15 (App Router)**         | Server components for the achievements file-scan; static page output for everything else; built-in API routes for the contact form on the same deploy. |
| **React 19**                        | Concurrent rendering, native `use()`, smaller runtime. Required by Next 15.                    |
| **TypeScript (strict)**             | Catch malformed `lib/content.ts` entries at build time. Strict mode + `noEmit` + `isolatedModules`. |
| **Plain CSS (no Tailwind)**         | The design was already a single `.css` file. Tailwind would have meant rewriting hundreds of class names with no benefit; plain CSS lets the source stay close to the design hand-off. |
| **No UI library (no shadcn/MUI)**   | Custom-feeling design — everything is bespoke, so no component library would map cleanly.       |
| **Resend (optional)**               | Cheapest transactional-email path; SDK is tiny; works on Fluid Compute Node 24.                |
| **Vercel Fluid Compute (Node 24)**  | Default 300s timeout, instance reuse → near-zero cold-starts for the contact route. No `vercel.json` needed; framework auto-detect. |
| **`framer-motion`**                 | Installed but **not currently used** in any rendered component — all motion is plain CSS + IntersectionObserver. Kept available for future micro-interactions. |
| **Simple Icons CDN (`cdn.simpleicons.org`)** | Brand logos for the skill grid's hover state — single SVG per slug, color-tinted via URL. Whitelisted in `next.config.ts` images config. |

**Notable non-choices:**

- No CMS — content lives in `lib/content.ts` and `lib/achievements.ts`. Git is the audit trail.
- No analytics or telemetry shipped.
- No service worker / PWA — single-page, no offline expectation.
- No state library (Redux/Zustand) — UI state lives in component-local `useState` or DOM data attrs.
- No CSS-in-JS — one global stylesheet, zero runtime CSS cost.

---

## Project layout (the "where")

```
C:\Vansh_portfolio
├── app/
│   ├── layout.tsx                # html shell, fonts, body classes, skip-link
│   ├── page.tsx                  # server component — single-page composition
│   ├── globals.css               # 2,200+ lines of design CSS (verbatim port + mobile pass)
│   ├── robots.ts                 # MetadataRoute.Robots — allow all
│   ├── sitemap.ts                # MetadataRoute.Sitemap — single URL
│   └── api/
│       ├── contact/route.ts      # POST contact form (Resend + honeypot + rate-limit)
│       ├── achievements/route.ts # GET achievements w/ optional tier filter, CDN-cached
│       └── health/route.ts       # GET liveness probe (timestamp, node, env)
│
├── components/
│   ├── ClientRuntime.tsx         # one-stop runtime hook — clock, cursor, IO reveals, ⌘K, mobile drawer, skills auto-cycle, tweaks
│   ├── ContactForm.tsx           # form w/ honeypot field + ok/warn/err states
│   ├── ProjectThumb.tsx          # hand-drawn SVG thumbs (1 per project), scoped gradient IDs
│   ├── NeuralBackground.tsx      # <canvas> flow-field particle field behind hero
│   └── achievements/
│       ├── AchievementsGrid.tsx       # grid wrapper + lightbox state
│       ├── AchievementCard.tsx        # photo card w/ gallery cycling, tier pill, summary
│       ├── AchievementLightbox.tsx    # fullscreen modal w/ autoplay, keyboard nav
│       └── SpotlightTracker.tsx       # one global pointermove → :root vars for spotlight CSS
│
├── lib/
│   ├── content.ts                # ALL portfolio data — HERO, ABOUT, EXPERIENCE, PROJECTS, SKILL_ROWS, CONTACT_LINKS, NAV_SECTIONS
│   ├── achievements.ts           # achievement registry (slug, tier, name, summary, tags, …)
│   └── achievements-server.ts    # server-only: scans /public/achievements/, auto-resolves photo+gallery
│
├── public/
│   ├── achievements/             # photos auto-discovered by slug-N.<ext>
│   │   └── README.md             # authoring guide
│   ├── orgs/                     # iit-patna.png, xproguard.png  (org logos)
│   │   └── README.md
│   ├── assets/
│   │   ├── avatar.jpg
│   │   └── avatar-cutout.png     # transparent PNG used in the hero (cutout, no background)
│   └── resume.pdf
│
├── next.config.ts                # reactStrictMode + Simple Icons CDN allow-list
├── tsconfig.json                 # strict TS, "@/*" path alias to project root
├── package.json                  # deps + scripts
├── .env.local.example            # copy → .env.local for Resend wiring
├── .gitignore                    # node_modules, .next, .env*.local, .data/, .claude/, portfolio/
└── README.md                     # this file
```

**Intentional omissions (gitignored):**

- `portfolio/` — the original design hand-off (HTML/CSS source bundle). Kept locally for reference; not committed.
- `_design.tar.gz` — design archive.
- `.data/` — local fallback log for contact-form submissions (`.data/contact-log.jsonl`). Contains private user submissions.
- `.claude/` — local Claude Code settings.
- `next-env.d.ts` is committed (Next.js convention).

---

## How it runs at runtime

```
                       ┌───────────────────────────────────────┐
   Request ──HTTP──►   │  Vercel edge router                   │
                       └───────────────────────────────────────┘
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              │                           │                           │
              ▼                           ▼                           ▼
    Static asset                Server component                Route handler
    (resume.pdf,              (app/page.tsx runs               (app/api/*/route.ts
     avatar, achievement      `getResolvedAchievements()`       — Node 24, Fluid)
     photos)                   which scans /public/
                               achievements at request time)
              │                           │                           │
              ▼                           ▼                           ▼
    Served from CDN            Returns full HTML with         JSON response
                               embedded server state →        (contact, achievements,
                               hydrates with ClientRuntime    health)
```

**Server boundary:** `app/page.tsx` is a server component. It calls `getResolvedAchievements()`
(which does an `fs.readdir` of `public/achievements/`) at request time and passes the resolved
list down to `<AchievementsGrid>`. Everything else on the page is static markup.

**Client boundary:** `<ClientRuntime />` is mounted once at the bottom of the page. It's marked
`"use client"` and wires *every* piece of interactive behaviour in a single `useEffect` — clock,
cursor, scroll-driven timeline, intersection-observer reveals, ⌘K palette, mobile nav drawer,
skills filter + auto-cycle, tweaks panel, achievement flip cards, hero 3D tilt. Keeping it all
in one place (instead of one client component per behavior) keeps the page tree mostly server,
and means there's one place to add or remove a behavior.

Why one big `useEffect`? It runs once on hydrate, registers all listeners and observers, returns
a cleanup tuple. There's no UI state in this component (`return null`) — it's pure side-effect
glue. Splitting it into smaller "use client" components would mean more JS bundles + more
hydration boundaries for no readability win.

---

## Page anatomy (section-by-section)

`app/page.tsx` renders the page top-to-bottom; each section is a `<section id="…">` so the side
rail and ⌘K both target them by hash.

### 1. Topbar (fixed)
Brand + status (live IST clock, ● pulse, location). Mobile (≤ 900px) adds the hamburger button.
Uses `mix-blend-mode: difference` on desktop for invert-on-content; flat backdrop on mobile so
the drawer animation looks clean.

### 2. Side rail (fixed left)
Vertical section labels. Active section is highlighted by an IntersectionObserver in
`ClientRuntime`. A `.rail-indicator` dot FLIP-tweens to the active link's vertical center.
Hidden on mobile — replaced by the drawer.

### 3. Hero (`#hero`)
- `<NeuralBackground />` — `<canvas>` flow-field of accent-tinted particles drifting through a noise
  field; subtle vignette on top. 300 particles by default; reduces opacity on small screens.
- Avatar (transparent PNG cutout) with 3D parallax — `mousemove` over the hero feeds CSS vars
  `--rx`, `--ry` for tilt and `--mx`, `--my` for the shine sweep. Scroll position drives `--py`
  for parallax drift. Disabled on touch + reduced-motion.
- Title is split into `<span class="word">` chunks at hydration so each word reveals with a
  staggered upward fade (`--i` index drives delay).
- Hero meta (GPA / focus / location / status) — each cell `boot-flicker`s in like a CRT bringing
  up readings.

### 4. About (`#about`)
Two columns: a free-text bio (with italic accent) on the left and a `// currently` card on the
right (key/value rows with the IIT Patna logo inline). Stacks on mobile. Includes the "Download
résumé · PDF" link, styled like a console-output pill.

### 5. Experience (`#experience`)
Timeline with a 1px vertical rail. A second 1px rail fills with the accent as you scroll
(`--tl-fill` is computed on every `scroll`/`resize`). Each item has a dot that "ignites"
(pulse-on-enter) when its row scrolls into view. Mobile collapses to a single column with the
rail on the left edge.

### 6. Projects (`#projects`)
Two display modes governed by `data-projects` on `<html>`:
- **list** — densely packed rows, columns: number, title, description, stack pills, arrow.
- **cards** (default) — 2-column grid, each card has a hand-drawn SVG thumb at the top
  (`<ProjectThumb id={...} />`). Thumbs draw on-enter using `stroke-dashoffset` + `data-draw`
  attributes (length computed via `SVGGeometryElement.getTotalLength()` after mount).

### 7. Skills — "Periodic table" (`#skills`)
6 category rows × variable cells. Each cell carries:
- Atomic-number style label (`No. 01`) + proficiency dots (1–5)
- 2-letter "symbol" (`Py`, `TF`, `RAG`, …)
- Name on a single ellipsized line
- Per-tile color theme variables (`--c1`, `--c2`) for hover gradient
- On hover, swaps the symbol for a circular white badge + brand logo (Simple Icons CDN)

A toolbar above lets you filter by category (`all`, `languages`, `ml`, `data`, `backend`,
`infra`, `cv`). Below sits a "readout" strip showing details for the focused cell, which
auto-cycles every 2.2s through visible cells like a teletype.

Mobile: chips become a horizontally scrollable row, cells get smaller, stats column drops out
of the readout.

### 8. Achievements (`#awards`)
3-column grid of cards (2 columns ≤ 1100px, 1 column ≤ 700px). Each card:
- Photo banner (`<button>` — clicking cycles through the gallery), with a tier pill (`★ Winner`,
  silver, bronze) and number badge
- Animated photo-in (scale + translate + blur fade)
- Body with serif name, mono meta line, 3-line clamped summary, tag pills
- Bottom-right arrow opens the **lightbox**

The grid is wrapped with `<SpotlightTracker />` which publishes pointermove coords to `:root`
as CSS variables. Cards with `[data-spotlight]` render a radial gradient that follows the cursor
via `background-attachment: fixed` — so one set of root vars renders correctly on every card.

**Lightbox** (`AchievementLightbox`):
- Two-column on desktop (photo + body); stacked on mobile
- Autoplay every 4.5s, pauses on arrow-key nav or `||` button
- ESC closes; ←/→ navigate; click-out closes
- Body-scroll locked while open

### 9. Contact (`#contact`)
Large serif "Got something worth *building*?" headline (the `<em>` has a 4s "breathing" glow
animation that runs only while the title is in view). Below: a 2-column grid of contact links
(email, GitHub, LinkedIn, phone) that slides on hover. Then the contact form. Footer at the
bottom.

---

## Mobile responsive pass

The desktop layout is treated as a separate, complete design. Mobile is layered **on top** via
media queries — desktop is never re-derived from mobile. Breakpoints:

| Breakpoint        | Purpose                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `≤ 900px`         | Activates mobile drawer + hamburger; stacks all 2-col grids        |
| `≤ 768px`         | Tighter hero avatar; smaller skill cells                           |
| `≤ 700px`         | Achievements collapse to 1 column                                  |
| `≤ 560px`         | Lightbox stacks; achievement cards compact                         |
| `≤ 480px`         | Refined hero, smaller meta                                         |
| `≤ 380px`         | Topbar squeeze; minimum-viable layout                              |
| `(hover: none) and (pointer: coarse)` | Touch-only: hide custom cursor, tweaks panel, ⌘K hint; enforce 44px hit targets |
| `(prefers-reduced-motion: reduce)`    | All animation gated on `no-preference`; fallbacks make cells immediately visible |

**Mobile-specific UI:**

- **Hamburger button** in topbar (40×40, 3 animated bars → X on open)
- **Drawer** (`#mobile-nav`) — fullscreen, slides in from the right, with:
  - Accent vertical-rail on the left edge
  - Section links with staggered slide-in (each gets `--i` for delay)
  - Active section synced with the same observer that drives the desktop side rail
  - "Résumé · PDF" CTA + status line in the footer
  - Closes on link tap, ✕ button, Escape, or window resize back to desktop
  - Body scroll locked via `body.nav-open { overflow: hidden; touch-action: none; }`

All mobile rules live in dedicated `@media (max-width: …)` blocks near the bottom of
`globals.css` — desktop CSS above is untouched.

---

## Backend routes

All routes are App Router route handlers (`route.ts`). They run on Vercel Fluid Compute under
the Node.js runtime.

| Route                | Method | Runtime  | Purpose                                                                                                    |
| -------------------- | ------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `/api/contact`       | POST   | `nodejs` | Accepts form payload, validates, applies honeypot + in-memory rate limit, persists to JSONL, sends email via Resend if configured. Wrapped in a top-level try/catch that returns `{ ok: false, error: "Server error: …" }` on any unhandled throw. |
| `/api/contact`       | GET    | `nodejs` | Returns a tiny endpoint manifest (method + expected fields) — useful for hand-testing.                     |
| `/api/health`        | GET    | `nodejs` | `{ ok: true, service, timestamp, node, env }`. Liveness probe / build metadata.                            |
| `/api/achievements`  | GET    | `nodejs` | Returns the resolved achievement list (with auto-discovered photo paths). Optional `?tier=winner` filter. Cached at the CDN: `s-maxage=3600, stale-while-revalidate=86400`. |
| `/sitemap.xml`       | GET    | static   | Single-URL sitemap (root).                                                                                 |
| `/robots.txt`        | GET    | static   | `User-agent: *` allow all.                                                                                 |
| `/resume.pdf`        | GET    | static   | Served from `public/resume.pdf`.                                                                           |

### Contact request body

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "subject": "Research collab",
  "message": "Hey Vansh, ...",
  "website": ""
}
```

- `website` is a **honeypot** — bots auto-fill all inputs; humans never see it (hidden off-screen).
  If non-empty, the route returns `{ ok: true }` and silently drops the message.
- Validation: name 2–120 chars, email regex match + max 200, message 10–4000 chars.
- Rate limit: 5 submissions per IP per 60s window, tracked in an in-memory `Map` on each warm
  Fluid instance. Resets when the instance recycles. Real abuse protection is delegated to
  the honeypot + Resend itself.

### Contact response

```json
{
  "ok": true,
  "delivered": false,
  "configured": false,
  "note": "Stored locally — set RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL to deliver via email."
}
```

| Field        | Meaning                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| `ok`         | Request was accepted (valid + not rate-limited).                              |
| `delivered`  | Email was actually sent via Resend. `false` ⇒ stored locally only.           |
| `configured` | All three Resend env vars are set. `false` ⇒ delivery isn't even attempted.  |
| `note`       | Human-readable explanation — shown back to the user if delivery failed.       |

The form treats `ok && delivered` as success (green), `ok && !delivered` as a **warning**
(amber — "logged but not emailed"), and `!ok` as an error (red). The user is never falsely told
their message was sent.

---

## Data sources — how content is authored

All copy lives in TypeScript. There is intentionally **no CMS, no JSON file, no MDX**. The
trade: code-review for content changes, free type checking, fast iteration in the same project.

### `lib/content.ts`

Exports typed constants consumed by `app/page.tsx`:

| Export           | Shape                                  | Renders to                                            |
| ---------------- | -------------------------------------- | ----------------------------------------------------- |
| `HERO`           | `{ eyebrow, titleHtml, roleHtml, sub, meta[] }` | The whole hero block. `titleHtml`/`roleHtml`/`sub` accept HTML so you can drop `<em>` italics for the accent words. |
| `ABOUT_PARAS`    | `string[]` (HTML allowed)              | The about column paragraphs.                          |
| `ABOUT_CARD`     | `{ k, v, hl? }[]`                      | The `// currently` card rows.                         |
| `EXPERIENCE`     | `Experience[]`                         | The timeline. Each entry has bullets (HTML allowed) + metrics. `logo` is optional and looks for `/public/orgs/<logo>`. |
| `PROJECTS`       | `Project[]`                            | The projects list/cards. `thumbId` selects an SVG from `<ProjectThumb>`. `tag` adds a `[research]`-style chip. |
| `SKILL_ROWS`     | `SkillRow[]`                           | The periodic table. Each cell has `n` (atomic number), `sym` (2-letter glyph), `name`, `desc`, `projects`, `dots` (1–5), `theme` (gradient class). |
| `CONTACT_LINKS`  | `{ label, handle, href }[]`            | The 4 contact cells (email, GitHub, LinkedIn, phone).|
| `NAV_SECTIONS`   | `{ id, label }[]`                      | Side rail + ⌘K + mobile drawer labels.                |

### `lib/achievements.ts`

See [achievements section](#achievements-system-auto-discovery).

---

## Achievements system (auto-discovery)

Adding a new achievement is intentionally low-friction:

**1. Drop one or more photos in `public/achievements/`** with a shared filename prefix:

```
public/achievements/devhacks-2026-1.jpg
public/achievements/devhacks-2026-2.jpg
public/achievements/devhacks-2026-3.jpg
```

**2. Add an entry to `lib/achievements.ts`**:

```ts
{
  id: "devhacks-2026",
  tier: "winner",                   // "winner" | "silver" | "bronze"
  tierLabel: "★ Champions",
  name: "DevHacks 6.0 — Winners",
  num: "/02",
  org: "Atharva College · CSI-ACE",
  date: "2026",
  location: "Mumbai",
  photoSlug: "devhacks-2026",       // matches "devhacks-2026-N.jpg" files above
  summary: `Paste the LinkedIn caption here.

Newlines between paragraphs are preserved.`,
  tags: ["National", "24hr"],
}
```

The server component (`lib/achievements-server.ts`) does an `fs.readdir` of
`public/achievements/` at request time and matches every `<photoSlug>-<n>.<ext>` file. It uses
natural sort (`devhacks-2026-2 < devhacks-2026-10`, `6.0 < 7`), so file numbering can be any
range. The first match becomes the card banner photo; the rest populate the lightbox gallery.

**Manual override:** set `photo: "..."` and `gallery: ["...", ...]` to skip auto-discovery (legacy).

Items without any photos render an accent-tinted gradient fallback with a tier glyph (`★`/`▪`/`▫`).
Items without a `summary` show only the headline.

The `/api/achievements` route exposes the same resolved data over HTTP for any future
consumer (a CV page, a separate blog, etc.).

---

## Contact form & email delivery

The contact route has three operational states, and the form surfaces each:

| State                  | Status pill                                                                          | Backend response                                       |
| ---------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Sent via Resend        | `✓ MESSAGE SENT · I'LL REPLY SOON` (accent green)                                    | `ok: true, delivered: true, configured: true`          |
| Logged, no Resend      | `✓ MESSAGE LOGGED · EMAIL DELIVERY OFFLINE — REACH ME AT PATILVANSH822@GMAIL.COM` (amber warn) | `ok: true, delivered: false, configured: false`        |
| Logged, Resend failed  | `✓ MESSAGE LOGGED · EMAIL DELIVERY FAILED — TRY EMAIL DIRECTLY` (amber warn)         | `ok: true, delivered: false, configured: true`         |
| Validation / rate-limit| `✗ <reason>` (red err)                                                               | `4xx` with `ok: false, error: ...`                     |
| Server error           | `✗ SERVER ERROR: <detail>` (red err)                                                 | `500` with `ok: false, error: ...`                     |

**Persistence:** even when Resend isn't configured (or fails), the payload is appended as a
JSONL line. On Vercel that's `/tmp/contact-log.jsonl` (read-only filesystem except `/tmp`).
Locally that's `.data/contact-log.jsonl` (gitignored). If even that write fails, the payload is
logged to stdout so it surfaces in Vercel runtime logs.

**Honeypot:** the `website` field is positioned off-screen via inline styles and `tabindex="-1"`,
`autocomplete="off"`. Bots that fill all inputs blindly hit it; the route returns 200 OK and drops
the submission.

---

## Environment variables

All optional — without them, messages are persisted locally and the form shows the
"EMAIL DELIVERY OFFLINE" warning.

| Variable             | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| `RESEND_API_KEY`     | API key from [resend.com/api-keys](https://resend.com/api-keys).       |
| `CONTACT_TO_EMAIL`   | Inbox where messages land. e.g. `patilvansh822@gmail.com`.             |
| `CONTACT_FROM_EMAIL` | **Must be on a domain verified in your Resend dashboard.** Otherwise Resend rejects the send and the form will show "logged but not emailed". For testing on Resend's sandbox, you can use `onboarding@resend.dev` — but Resend only allows that sender to deliver to the email tied to your Resend account. |

Local: copy `.env.local.example` → `.env.local` and fill values. **Don't commit `.env.local`** —
it's gitignored.

Production: add the same three keys to **Vercel Project → Settings → Environment Variables →
Production**, then redeploy.

---

## Performance & accessibility

**Bundle (first load shared JS): ~102 KB gzipped.**
- Page route adds ~9 KB for client islands (form, achievements grid, runtime).
- No CSS-in-JS runtime, no UI library, no analytics SDK.

**Performance posture:**
- Server component does the achievement folder scan once per request (cached at CDN for hourly
  revalidation via the `/api/achievements` route).
- Fonts use `preconnect` + `display=swap` to avoid invisible-text FOIT.
- Images use plain `<img>` (cards are not above-the-fold critical; lazy-loaded by default in
  modern browsers).
- Custom cursor + neural canvas + 3D tilt all skipped on touch and on `prefers-reduced-motion`.
- The neural canvas runs at 0.42 opacity, 300 particles by default; opacity drops to 0.28 below 560px
  (DPR-cap could be added if low-end Android shows jank).

**A11y:**
- Skip link (`.skip-link`) at the top — accent-bordered, slides in on focus.
- `<main id="main-content" tabIndex={-1}>` is the skip target.
- Headers use proper `<h1>`/`<h2>`/`<h3>` hierarchy.
- All buttons and links are real `<button>` and `<a>`; no `<div onClick>`.
- Focus-visible rings everywhere (`outline: 2px solid var(--accent); outline-offset: 3px`).
- Keyboard navigation: ⌘K palette + lightbox arrow keys + ESC to close drawer or modals + Tab order.
- `prefers-reduced-motion: reduce` is honored throughout — every animation has a fallback that
  leaves content visible.
- `aria-live="polite"` on the form status; `aria-modal="true"` on lightbox and mobile nav.
- `aria-hidden` on decorative elements (grain, cursor, scroll-hint, etc.).

---

## Quickstart & scripts

```bash
# Install deps
npm install

# Optional — wire Resend
cp .env.local.example .env.local
#   then fill RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL

# Dev server
npm run dev        # → http://localhost:3000

# Type-check (no emit)
npx tsc --noEmit

# Lint
npm run lint

# Production build
npm run build

# Serve the production build locally
npm run start
```

| Script          | What it does                                                       |
| --------------- | ------------------------------------------------------------------ |
| `npm run dev`   | Next dev server, Turbopack-ready, port 3000.                       |
| `npm run build` | Next production build. Statically generates `/`, `/sitemap.xml`, `/robots.txt`; route handlers stay dynamic. |
| `npm run start` | Serves the `.next` build output.                                   |
| `npm run lint`  | Next's bundled ESLint.                                             |

---

## Deployment (Vercel)

```bash
# First time
npm i -g vercel
vercel link               # link to a project

# Push
vercel deploy             # preview deploy
vercel deploy --prod      # production
```

- **Runtime**: Fluid Compute, Node 24 LTS (default in 2026).
- **Function timeout**: 300s (default; the contact route is sub-second).
- **No `vercel.json` is needed** — framework auto-detect handles it. If you later need to add
  cron jobs, headers, or rewrites that aren't expressible in code, prefer `vercel.ts`
  (`@vercel/config`) over `vercel.json`.
- Set the three Resend env vars in **Project Settings → Environment Variables → Production**.
- Custom domain `vanshpatil.dev` is added via Vercel's Domains UI.

---

## Adding / editing content (cookbook)

### Change hero copy
Edit `HERO` in `lib/content.ts`. `titleHtml`, `roleHtml`, and `sub` accept HTML — wrap accent
words in `<em>` and the existing CSS will italicize + tint them.

### Add an experience entry
Append to `EXPERIENCE` in `lib/content.ts`. Most-recent goes at the top. To attach an org logo,
drop the PNG into `public/orgs/` and set `logo: "<slug>.png"`.

### Add a project
Append to `PROJECTS`. The `thumbId` references a switch case in `components/ProjectThumb.tsx` —
to add a new visual, copy an existing `case` and edit the SVG.

### Add a skill cell
Append to the right `SKILL_ROWS[i].items` array. `theme` references a per-tile color class in
`globals.css` (look for `.t-py`, `.t-tf`, etc. and add a matching `--c1`/`--c2` pair if you
introduce a new theme). If you want a brand-logo swap on hover, add an entry to `ICONS` in
`ClientRuntime.tsx` keyed by the cell's `sym`.

### Add an achievement
1. Drop photos in `public/achievements/` named `<slug>-1.jpg`, `<slug>-2.jpg`, …
2. Add an entry to `ACHIEVEMENTS` in `lib/achievements.ts` with `photoSlug: "<slug>"`.

### Change the accent color permanently
The default is set on `<html data-accent="chartreuse">` in `app/layout.tsx`. Change to `"amber"`,
`"cyan"`, `"coral"`, or `"violet"`. Variants are defined at the top of `globals.css` (`[data-accent="..."]`).

### Swap display font default
`<html data-display="serif">` in `app/layout.tsx`. Change to `"sans"` for Geist-everywhere.

### Default to list-mode projects
`<html data-projects="cards">` in `app/layout.tsx`. Change to `"list"`.

---

## Tweaks panel & ⌘K palette

**Tweaks panel** (bottom-right; opens via ⌘K → "Toggle Tweaks panel"):
- Accent: chartreuse / amber / cyan / coral / violet
- Display font: serif / sans
- Projects layout: list / cards
- Grain overlay: on / off
- Cursor: custom / native

State lives in `ClientRuntime` and is applied to `<html data-*>` + `<body class>` so the entire
design language flips instantly via CSS. **Not persisted** — refresh resets to defaults.
On touch devices the panel is hidden entirely.

**⌘K command palette:**
- ⌘K / Ctrl-K opens it
- Type to filter
- ↑/↓ to navigate, Enter to run, Esc to close
- Sections (`Go to About`, `Go to Projects`, …) scroll smoothly
- Email / GitHub / LinkedIn / résumé open external
- "Toggle Tweaks panel" opens the panel

---

## Troubleshooting

**Contact form shows ✗ on Vercel.**
1. Check **Vercel → Project → Deployments → [latest] → Functions → /api/contact → Logs**.
   The route now logs explicit `[contact] resend error:` and `[contact] unhandled error:` lines.
2. Common cause: `CONTACT_FROM_EMAIL` uses an unverified domain in Resend. Either verify the
   domain in Resend's dashboard, or use Resend's sandbox sender `onboarding@resend.dev` (which
   only delivers to the email that owns the Resend account).
3. If `RESEND_API_KEY` isn't set on Vercel, the form will show an amber warning, not red — it
   never claims a fake success.

**Skills' brand logos don't appear.**
The `cdn.simpleicons.org` slug for that skill is wrong or the domain is blocked. Check the
`ICONS` mapping in `components/ClientRuntime.tsx` and verify the slug at https://simpleicons.org.
The domain is allow-listed in `next.config.ts`.

**Hero portrait flickers / looks wrong.**
`/public/assets/avatar-cutout.png` must be a transparent PNG (background removed). The page CSS
assumes transparency for the gradient + drop-shadow grade.

**`npm run build` fails on a content edit.**
The `Experience` / `Project` / `SkillRow` types in `lib/content.ts` are strict — TypeScript will
flag missing fields. Check the error path; it points to the exact `lib/*.ts` line.

**Achievement photo doesn't show.**
Check the filename matches `<photoSlug>-N.<ext>` (kebab-case slug + dash + integer + image
extension). Look at the Achievements route response: `curl http://localhost:3000/api/achievements`
shows `resolvedPhoto` and `resolvedGallery` for each entry.

**Mobile drawer doesn't close.**
The drawer auto-closes on link tap, the ✕ button, Escape, and on resize back to desktop. If a
link doesn't have `data-section` or isn't inside `.mobile-nav-link`, it won't trigger the
auto-close — that's by design (external links still close because the click listener fires).

---

## Conventions & coding style

- **No comments unless the *why* is non-obvious.** Naming + types do most of the explaining.
- **No dead code, no scaffolded files.** Add things when needed.
- **CSS is a single global stylesheet.** Adding component-scoped styles is fine in principle,
  but the design source was a single file and the convention has been to preserve that.
- **All interactive client behavior funnels through `ClientRuntime.tsx`.** Adding a new behavior
  generally means adding a block inside the one big `useEffect`.
- **TypeScript strict everywhere.** No `any`, no `// @ts-ignore` — use `unknown` + narrowing.
- **Server vs client boundary is conscious.** If a component doesn't need browser APIs, leave
  it as a server component.
- **HTML allowed in content.** Several `content.ts` fields accept raw HTML and use
  `dangerouslySetInnerHTML`. Inputs are author-controlled (your own copy in TypeScript), so this
  is safe — but don't extend that pattern to user-submitted data.

---

## Roadmap

Things explicitly *not* shipped, but on the table:

- Per-project case-study pages (`/projects/<slug>`) with longer write-ups
- Blog (`/writing`) — MDX with the same design language
- Vercel Analytics for traffic insight
- Vercel BotID on `/api/contact` for stronger bot defence than the honeypot
- Vercel AI Gateway demo embedded in the contact form (a "summarize my message" preview)
- Optional `vercel.ts` config if cron jobs or per-route caching headers become useful

---

**Made by Vansh Patil**
Mumbai · 2026
[patilvansh822@gmail.com](mailto:patilvansh822@gmail.com) · [GitHub](https://github.com/vanshpatil16) · [LinkedIn](https://linkedin.com/in/vansh-patil)
