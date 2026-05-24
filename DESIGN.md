# Design System — Vansh Patil Portfolio

> Single source of truth for visual decisions. This system was authored as a static
> design hand-off (`_design.tar.gz`) and ported pixel-for-pixel to Next.js. Extracted
> into this file on 2026-05-22 from the README and `app/globals.css`.
>
> **Anything that changes the look of this site changes this file first.**

---

## Product Context

- **What this is:** A single-page personal portfolio for an ML engineer and researcher. Dense, deliberate, every section custom rather than templated.
- **Who it's for:** Hiring managers, research collaborators, founders evaluating fit. Reads like a CV that respects the reader's time but rewards close attention.
- **Space/industry:** Engineering / research portfolios. Peers are dense personal sites in the [rauchg.com / brittanychiang.com / linear.app] tradition rather than templated CV builders.
- **Project type:** Marketing site (single page, multi-section), not a web app.

---

## Aesthetic Direction

- **Direction:** Dark editorial-terminal. Print-editorial typography (serif display, generous hero), grafted onto a terminal-system chrome (mono labels, section numbers, IST clock, ⌘K palette, custom cursor).
- **Decoration level:** Intentional. Grain overlay (toggleable), neural-particle canvas behind the hero, hand-drawn SVG project thumbs. No purple gradients, no icon-in-circle feature grids, no decorative blobs.
- **Mood:** "Built by hand, not assembled." A reader should feel like they're looking at one person's craft, not a template the person filled in.
- **Memorable thing:** The chartreuse accent against deep neutral black, plus the serif italic `<em>` that the entire layout points at.
- **Reference posture:** Editorial print (Wallpaper*, MIT Tech Review issues) for the type, dev terminals (Linear, Vercel, Resend) for the chrome.

---

## Typography

| Role            | Font                          | Loading              | Notes                                                          |
| --------------- | ----------------------------- | -------------------- | -------------------------------------------------------------- |
| Display / Hero  | **Instrument Serif** (italic) | Google Fonts, `swap` | Serif with a real italic; powers `.hero-title`, section titles, project & achievement names. Sans fallback when `data-display="sans"` (Geist 500/600 + underline `<em>`). |
| Body            | **Geist** (300–700)           | Google Fonts, `swap` | Body copy, longer-form paragraphs, hero sub. Native `tabular-nums` available if needed. |
| UI / Chrome     | **JetBrains Mono** (300–500)  | Google Fonts, `swap` | Every label, metric pill, timestamp, kbd, section eyebrow, status text. Letter-spaced 0.04–0.22em depending on role. |
| Code            | JetBrains Mono                | Same as above        | Reused — there is no separate code font.                       |

**Fluid scale (clamps used in code, not a tidy modular scale):**

| Element                       | Value                                  |
| ----------------------------- | -------------------------------------- |
| `.hero-title`                 | `clamp(72px, 13vw, 200px)`, line-height 0.88, letter-spacing -0.045em |
| `.contact-title`              | `clamp(56px, 9vw, 128px)`, line-height 0.95, letter-spacing -0.03em |
| `.section-title`              | 48px desktop / 30px ≤900px / 26px ≤480px, letter-spacing -0.02em |
| `.exp-role h3`                | 32px desktop / 22px ≤900px              |
| `.proj-title`                 | 28px (list) / 24px (cards) / 20px ≤900px |
| `.achv-name` / `.ach-name`    | 22px desktop / 18px mobile              |
| `.hero-sub`                   | 18px / 15px ≤900px, line-height 1.55    |
| `.about-text p`               | 18px / 16px ≤900px, line-height 1.6, `max-width: 52ch` |
| Body default                  | 16px, line-height 1.5                   |
| Mono chrome (default)         | 10.5–13px                               |

**Anti-patterns explicitly avoided:** Inter, Roboto, Space Grotesk, system-ui as primary, all-caps for body, gradient text fills.

---

## Color

- **Approach:** Restrained. One accent doing all the heavy lifting against a five-step neutral ramp. Color is rare and meaningful — it earns attention every time it appears.

**Neutrals (dark editorial ramp):**

| Token             | Value      | Use                                                        |
| ----------------- | ---------- | ---------------------------------------------------------- |
| `--bg`            | `#0a0a0a`  | Page background. Deep neutral, not pure black — pure black would crush the grain. |
| `--bg-elev`       | `#111111`  | Cards, raised surfaces, readout strip, contact form.       |
| `--bg-card`       | `#141414`  | Interior nested surfaces (proj-row hover, achievement back face). |
| `--border`        | `#1f1f1f`  | Default 1px divider.                                       |
| `--border-strong` | `#2a2a2a`  | Active / hover divider, chip outlines.                     |
| `--fg`            | `#f2f2ef`  | Warm off-white body. Not pure white — pure white feels clinical. |
| `--fg-muted`      | `#8a8a85`  | Secondary copy, descriptions. ~7.5:1 on `--bg`.            |
| `--fg-dim`        | `#6e6e68`  | Tertiary copy, dim labels. ~5.0:1 on `--bg` (passes WCAG AA after the 2026-05-22 polish pass; was `#5a5a55`). |

**Accent (chartreuse, default — swappable from the Tweaks panel):**

| Variant      | OKLCH                       | Hex approximation | Mood                              |
| ------------ | --------------------------- | ----------------- | --------------------------------- |
| chartreuse ★ | `oklch(0.88 0.18 120)`      | ~`#cce86d`        | Default — alert, electric, alive. |
| amber        | `oklch(0.82 0.17 75)`       | ~`#e3a04b`        | Warmer, more nostalgic-CRT.       |
| cyan         | `oklch(0.85 0.14 200)`      | ~`#7dd6e2`        | Cooler, datavis-leaning.          |
| coral        | `oklch(0.78 0.18 25)`       | ~`#e87766`        | Editorial-pop.                    |
| violet       | `oklch(0.75 0.18 300)`      | ~`#b380e0`        | Lab-coat / arXiv vibe.            |

`--accent-dim` is always `<accent> / 0.15` — used for subtle washes, focused chip backgrounds, button hover.

**Semantic (used only in the contact form status):**

| Role     | Color                       |
| -------- | --------------------------- |
| ok       | `var(--accent)`              |
| warn     | `oklch(0.82 0.17 75)` (amber) |
| error    | `oklch(0.7 0.2 25)` (red-coral) |

**Light mode:** None. This is a dark-only design — light mode is not a goal. The Tweaks panel swaps accent, not theme.

---

## Spacing

- **Base unit:** 4px implicit (most values are multiples of 4 or 8).
- **Density:** Comfortable on desktop (120px section padding), tightening to 72px ≤900px and 60px ≤480px. Hero/contact are oversized on purpose — the rest of the page reads denser by contrast.
- **Scale (de facto, from `globals.css`):**

| Token   | Value | Common use                                  |
| ------- | ----- | ------------------------------------------- |
| 2xs     | 4px   | Icon gaps, kbd padding                      |
| xs      | 8px   | Stack-pill padding, tight inline gaps       |
| sm      | 12–16px | Chip padding, paragraph rhythm            |
| md      | 24px  | Section-header gap, card row padding        |
| lg      | 32px  | Card padding, about-card padding            |
| xl      | 40–48px | Hero meta padding-top, contact title margin |
| 2xl     | 64px  | Section-header bottom margin                |
| 3xl     | 80px  | Main horizontal padding (desktop)           |
| section | 120px | `section { padding: 120px 0 }` desktop      |

**Layout chrome:**

- `main { max-width: 1200px; margin: 0 auto; padding: 0 80px; }`
- `@media (max-width: 900px) { main { padding: 0 20px; } }`
- `@media (max-width: 480px) { main { padding: 0 16px; } }`
- `@media (max-width: 380px) { main { padding: 0 14px; } }`
- `section { scroll-margin-top: 80px; }` desktop / `64px` ≤900px (clears the fixed topbar).

---

## Layout

- **Approach:** Grid-disciplined for the page shell, creative-editorial for the hero. The hero portrait bleeds past the 80px main padding to the right edge; everything else respects the grid.
- **Grid:**
  - Hero: free composition, portrait `position: absolute; right: -80px` with 3D tilt + scroll parallax.
  - About: 2-column (`1fr 1fr`, 80px gap) on desktop, single column ≤900px.
  - Experience: 3-column timeline (`140px 1fr 1fr`, 40px gap), single column ≤900px with left-rail dot moved to 36px offset.
  - Projects (list): 5-column row (`40px 1fr 2fr 200px 80px`). Cards mode: 2-column grid, single column ≤900px.
  - Skills periodic table: 2-column (`160px 1fr`) per category row, cells are 84×96px flex-wrap.
  - Achievements: 3-column → 2-column ≤1100px → 1-column ≤700px.
  - Contact: links 2-column (`1fr 1fr`), form max-width 720px, single column ≤900px / ≤600px depending on element.
- **Border radius:** Almost none. The system reads as editorial-terminal precisely because corners are sharp. Exceptions:
  - Pulse dots and cursor dots — `border-radius: 50%`.
  - Custom cursor ring — `border-radius: 50%`.
  - That's it. No 8/12/16px radius scale, no rounded buttons or cards. **This is a load-bearing decision** — adding radius drifts the design toward generic SaaS.

---

## Motion

- **Approach:** Intentional. Every animation is gated by `@media (prefers-reduced-motion: no-preference)`; content stays visible when motion is disabled.
- **Default easing:** `cubic-bezier(.2, .8, .2, 1)` — used everywhere except linear keyframes (`pulse`, `bob`, `clock-blink`).
- **Durations (de facto):**

| Tier             | Value      | Used for                                       |
| ---------------- | ---------- | ---------------------------------------------- |
| micro            | 100–200ms  | Hover color shifts, focus ring transitions     |
| short            | 200–300ms  | Cursor easing, chip hover, project-row hover   |
| medium           | 300–500ms  | Hero tilt return, cell entrance, slide draws   |
| long             | 600–900ms  | Reveal-in stagger, hero word-by-word, achievement flip |
| ambient          | 2–4s loop  | Pulse dot (gated), scroll-hint bob (gated), `<em>` breathing |

**Catalogued motion (in `globals.css`):**

1. Hero title staggered word reveal (`word-in`, 60ms-per-word stagger).
2. Hero meta cell boot flicker (`boot-flicker` + `boot-strip`, 0.12s stagger).
3. Section label clip-path roll + section-title clip-path slide (0.7–0.8s).
4. Side-rail sliding active indicator (FLIP-tween, 0.45s ease-out cubic-bezier).
5. Timeline bullet ring-pulse on enter (experience + achievements).
6. Project row title underline sweep (0.4s, scaleX 0 → 1, transform-origin left).
7. Project thumb SVG stroke-dashoffset draw on viewport enter (0.9s, with 0.15s delay).
8. Periodic-table cell staggered grid-in (22ms-per-cell).
9. Readout tape-advance ticker (0.22s, blur + translateY).
10. Achievement timeline dot ignite cascade (synced to scroll-driven `--tl-fill`).
11. Contact title `<em>` breathing (4s, viewport-gated).
12. Clock colon blink (1s, infinite, decorative).

**Hero portrait:** 3D parallax tilt driven by `mousemove` (RAF-eased toward target, 0.12 lerp factor, ±9° max). Disabled on touch and `prefers-reduced-motion`.

**Custom cursor:** Replaces native cursor on desktop (`cursor: none` body-wide). 28px ring + 4px dot, ring uses `mix-blend-mode: difference`. Disabled on touch via `(hover: none) and (pointer: coarse)`. Switchable from Tweaks panel.

**Neural background:** `<canvas>` flow-field particle system behind hero, 300 particles default, opacity 0.42 (0.28 ≤560px), `mix-blend-mode: screen`. Respects `prefers-reduced-motion`.

---

## Components — distinctive patterns

These don't fit cleanly under tokens but define the system's character:

- **Numbered section labels:** Every section header is `## NN / Label` in mono, accent-colored, letter-spaced 0.2em. Section-title sits below in serif (or sans if `data-display="sans"`).
- **`// comment-style` form titles:** `.contact-form::before { content: "// signal.send()" }` and `.about-card::before { content: "// currently" }` — comments-as-headings, terminal language applied to UI chrome.
- **Underlined italic `<em>`:** Serif mode = italic accent-colored. Sans mode = serif-italic gets swapped for accent-underlined sans (preserves the "this word matters" emphasis across font modes).
- **Hand-drawn SVG project thumbs:** One per project, scoped gradient IDs, animated by stroke-dashoffset on scroll-in. Beats stock screenshots.
- **Periodic-table skill grid:** Cells are 84×96px chemistry-table tiles. Hover swaps the sym to a real brand logo (Simple Icons CDN). Readout strip auto-cycles every 2.2s.
- **Achievement flashcards:** Photo-led cards with cursor-tracked spotlight glow (radial gradient at `--x/--y`). Click photo to cycle gallery, click body to open lightbox with Ken Burns + autoplay.
- **Tweaks panel + ⌘K palette:** Power-user surfaces — accent swap, font swap, projects layout, grain/cursor toggles in one panel; ⌘K palette for jumping anywhere.

---

## Accessibility

- All animations gated by `prefers-reduced-motion: no-preference`. Reduced-motion fallbacks leave content visible (`opacity: 1` for reveals, no transforms).
- Focus-visible: `outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px;` — keyboard-only.
- Skip link (`.skip-link`) is first focusable element; slides in from `translateY(-150%)` on focus.
- Touch targets: ≥44×44px enforced via `@media (hover: none) and (pointer: coarse)`.
- Mobile drawer uses `inert` + `aria-hidden` when closed (added 2026-05-22).
- Color contrast: `--fg-muted` 7.5:1, `--fg-dim` 5.0:1, `--fg` 17:1 (all on `--bg`).
- Honors `aria-live="polite"` on form status, `aria-modal="true"` on lightbox and drawer, `aria-hidden` on every decorative element (grain, cursor, scroll-hint, separator chars).

---

## Anti-patterns (do not introduce)

- ❌ Border-radius on cards, buttons, or images. Sharp corners are the system's signature.
- ❌ Inter / Roboto / system-ui as a display or body font.
- ❌ Light mode. The accent doesn't work on light backgrounds and the editorial-print mood is dark.
- ❌ Purple gradients, gradient buttons, gradient text fills.
- ❌ Icon-in-coloured-circle feature grids.
- ❌ Stock-photo hero compositions.
- ❌ Centered-everything layouts. The hero is asymmetric and the rest follows a clear left-anchor.
- ❌ Emoji used as UI icons. Use SVG (existing convention) or unicode glyphs styled as mono chrome (`↗`, `→`, `⤓`, `↻`) only in the terminal-chrome context.
- ❌ Tailwind, shadcn, MUI, or any component library. Plain CSS is the contract — porting away from it would lose the design hand-off fidelity.
- ❌ Bouncy/spring physics on functional interactions. The motion language is precise, not playful.

---

## Decisions Log

| Date       | Decision                                                          | Rationale                                                                                          |
| ---------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 2025-Q1    | Initial design authored as static HTML/CSS (`_design.tar.gz`)     | Hand-crafted in design first, then ported to Next.js — guarantees the code matches the design.     |
| 2025-Q1    | Plain CSS, no Tailwind / no UI library                            | Design hand-off was already a single `.css` file; rewriting in utilities would lose fidelity.       |
| 2025-Q1    | Custom cursor + grain overlay (toggleable)                        | Signature touches that telegraph "built by hand"; both default to ON (cursor) / OFF (grain).        |
| 2025-Q1    | Mobile drawer + ⌘K palette                                        | Power-user surfaces on desktop, drawer for mobile parity.                                          |
| 2026-05-22 | `--fg-dim` bumped `#5a5a55` → `#6e6e68`                           | 4.3:1 → 5.0:1 contrast; passes WCAG AA for small mono chrome.                                       |
| 2026-05-22 | Infinite `pulse` + `bob` animations gated by `prefers-reduced-motion` | Accessibility — both ran forever and ignored user motion settings.                                |
| 2026-05-22 | Mobile drawer gets `inert` when closed                            | Prevent tab-focus from landing on hidden drawer links.                                              |
| 2026-05-22 | `✕` nav-close glyph replaced with SVG X                           | Crispness + consistency with the project's no-emoji-icons rule.                                     |
| 2026-05-22 | `section` scroll-margin-top 40 → 80px (64px mobile)               | Anchor jumps now clear the fixed topbar.                                                            |
| 2026-05-22 | DESIGN.md extracted from README + `globals.css`                   | Establish single source of truth for future visual changes.                                         |
