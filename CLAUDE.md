# CLAUDE.md — agent instructions for this repo

## Design System

Always read [`DESIGN.md`](./DESIGN.md) before making any visual or UI decisions.
All font choices, colors, spacing, motion, and aesthetic direction are defined there.
Do not deviate without explicit user approval. In QA / review mode, flag any code
that drifts from the tokens or anti-patterns in DESIGN.md.

## Stack pinning

- Next.js 15 (App Router) + React 19 + TypeScript strict. No Tailwind, no UI library.
- Plain CSS in `app/globals.css` is the contract — do not introduce CSS-in-JS,
  Tailwind, shadcn, or MUI.
- All portfolio content lives in `lib/content.ts` and `lib/achievements.ts`. There is
  no CMS; git is the audit trail.

## Conventions

- Sharp corners — no `border-radius` on cards, buttons, or images (see DESIGN.md
  anti-patterns). Pulse dots and the custom cursor are the only allowed circles.
- Every animation must be gated by `@media (prefers-reduced-motion: no-preference)`.
- Touch targets ≥44×44px on `(hover: none) and (pointer: coarse)`.
- Use SVG (or styled mono unicode) for icons. No emoji icons.

## Platform

- Deployed on Vercel Fluid Compute, Node 24, no `vercel.json` (framework auto-detect).
- `.env.local` for Resend wiring. `.data/contact-log.jsonl` is the local fallback log
  and is gitignored.
