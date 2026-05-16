# Achievement images

Drop photos here and reference them in `lib/achievements.ts` by filename only
(e.g., `photo: "datahack-xai-2024.jpg"`).

## Conventions

- **Filename**: kebab-case slug + year. Example: `devhacks-mumbai-2024.jpg`
- **Format**: JPG/WEBP for photos, PNG for screenshots
- **Size**: 1600×1000 ideal, ≥ 1200×800. Will be displayed at ~600×360 in card view and fullscreen in lightbox.
- **Aspect**: ~16:10 looks best in the card banner; portraits also work — `object-fit: cover` handles all.

## Add a new achievement

1. Save the photo here as `<slug>.jpg`.
2. Edit `lib/achievements.ts` and add an entry:

```ts
{
  tier: "winner",                          // "winner" | "silver" | "bronze"
  tierLabel: "★ Winner",
  name: "DevHacks 24hr National",
  num: "/02",
  org: "CSI-ACE, Atharva",
  date: "2024",
  location: "Mumbai",
  photo: "devhacks-mumbai-2024.jpg",       // matches a file in this folder
  summary: "Won the 24hr national hackathon...", // paste LinkedIn-style summary here
  tags: ["National", "24hr"],
}
```

Items without a `photo` render a chartreuse gradient placeholder.
Items without a `summary` show just the headline.
