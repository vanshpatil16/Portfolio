# Organisation logos

Drop logos here as PNG (square if possible). Filenames are referenced from `lib/content.ts` via the optional `logo` field on each experience.

## Current files

| Filename          | Used by                                |
| ----------------- | -------------------------------------- |
| `iit-patna.png`   | Experience → "Research Intern, IIT Patna" + About card "org" row |
| `xproguard.png`   | Experience → "AI/ML Intern, Xproguard" (drop file here) |

## How to add a new logo

1. Save as `<slug>.png` here (e.g., `djsanghvi.png`).
2. In `lib/content.ts`, add `logo: "djsanghvi.png"` to the matching experience entry.

That's it — it'll appear next to the org name in the timeline. Missing files render no logo (graceful fallback).
