# Your Nightmare — Horror Stories Website Design Spec

**Date:** 2026-04-10
**Project:** your-nightmare
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4

---

## Overview

A horror folklore website built around an interactive world map. Users explore the map to discover horror stories, ancient tales, and supernatural beings from cultures around the world. The aesthetic is an ancient explorer's map — parchment, sepia, candlelight tones.

---

## Pages & Routes

### `/` — The Map
- Full-screen interactive world map using `react-simple-maps`
- The entire viewport is the map styled like aged parchment
- Hovering a region triggers a warm amber glow/flicker effect
- Clicking a region navigates to `/region/[slug]`
- Site title and a brief atmospheric tagline overlaid on the map

### `/region/[slug]` — Region Story Cards
- Header shows region name in serif font
- Grid of story cards for all stories in that region
- Each card displays: creature name, atmospheric image, teaser text, danger rating
- Clicking a card navigates to `/story/[slug]`
- Back button returns to the map

### `/story/[slug]` — Full Story Page
- Monster name as the page title
- Atmospheric image prominently displayed
- Full story text rendered as HTML from markdown
- Metadata: creature name, region, category, danger rating
- Styled like reading an ancient manuscript (narrow column, drop cap, decorative dividers)
- Back button returns to the region page

---

## Content Model

All stories live in `/content/stories/` as markdown files named after the monster (e.g., `wendigo.md`, `kuchisake-onna.md`).

### Frontmatter Schema
```markdown
---
title: "The Wendigo"
creature: "Wendigo"
region: "North America"
regionSlug: "north-america"
category: "Ancient Creature"
dangerRating: 5
teaser: "A ravenous spirit of the frozen north, born from cannibalism and insatiable hunger."
image: "/images/stories/wendigo.jpg"
---
```

### Categories
- Folklore
- Ancient Creature
- Supernatural Being
- Demon
- Ghost/Spirit
- Shapeshifter
- Deity
- Cursed Human

### Regions & Slugs
| Region | Slug |
|---|---|
| North America | `north-america` |
| South America | `south-america` |
| Europe | `europe` |
| Africa | `africa` |
| Middle East | `middle-east` |
| East Asia | `east-asia` |
| Southeast Asia | `southeast-asia` |
| South Asia | `south-asia` |
| Oceania | `oceania` |
| Arctic/Siberia | `arctic-siberia` |

### Initial Stories (~25)
Populated from world folklore knowledge. Includes: Wendigo, Kuchisake-onna, Djinn, Skinwalker, Aswang, Banshee, Baba Yaga, Ammit, Yuki-onna, La Llorona, Strigoi, Ahool, Popobawa, Rusalka, Manananggal, Gashadokuro, Nuckelavee, Abiku, Penanggalan, Cihuateteo, Stymphalian Birds, Rakshasa, Taniwha, and more.

### Images
- Stored in `/public/images/stories/`
- One image per creature
- Sourced from public domain: Wikimedia Commons, old woodcuts, folklore engravings

### Adding New Stories
To add a story, create a new `.md` file in `/content/stories/` following the frontmatter schema above. The filename should be the monster name in kebab-case (e.g., `black-shuck.md`). Drop the creature's image in `/public/images/stories/`.

---

## Technical Architecture

### Dependencies
```json
"react-simple-maps": "^3.x",
"gray-matter": "^4.x",
"remark": "^15.x",
"remark-html": "^16.x"
```
Google Fonts via `next/font`: **Cinzel** (titles/headings) + **IM Fell English** (body/story text)

### Component Structure
```
app/
  layout.tsx                — global fonts, parchment body background
  page.tsx                  — full-screen map page
  region/[slug]/page.tsx    — region story card grid
  story/[slug]/page.tsx     — full manuscript story page

components/
  WorldMap.tsx              — react-simple-maps SVG map with region click handlers
  StoryCard.tsx             — torn journal card: image, creature, teaser, danger rating
  DangerRating.tsx          — skull icon scale (1–5)
  StoryBody.tsx             — manuscript-styled HTML renderer for story text

lib/
  stories.ts                — fs + gray-matter: reads all .md files, exports typed Story[]
  regions.ts                — region slug → display name + country codes mapping

content/
  stories/                  — all .md files (one per creature)

public/
  images/stories/           — creature illustrations (public domain)
```

### Data Flow
- **Static generation only** — `lib/stories.ts` reads markdown files at build time using Node.js `fs`
- `generateStaticParams` on region and story pages for full static export
- No database, no API calls, no runtime data fetching
- Adding a story = adding a `.md` file + running `npm run build`

---

## Aesthetic & Styling

### Color Palette
| Token | Value | Usage |
|---|---|---|
| Parchment light | `#f5e6c8` | Map background, card backgrounds |
| Parchment mid | `#e8d5a3` | Borders, dividers |
| Sepia brown | `#5c3d1e` | Primary text |
| Deep sepia | `#3d2510` | Headings, strong elements |
| Blood rust | `#8b2500` | Danger rating, accents, links |
| Near black | `#1a0f00` | Dark overlays, deep shadows |

### Typography
- **Cinzel** — Titles, headings, navigation, creature names
- **IM Fell English** — Story body text, teasers, descriptive copy

### Map Styling
- SVG parchment texture overlay
- Vignette darkening toward edges
- SVG sepia/aged CSS filter on the map
- Regions: default sepia tone, hover → warm amber glow with subtle pulse animation

### Story Cards
- Rough/torn paper edge effect (CSS clip-path or border-image)
- Slight random rotation for character (`rotate-1`, `-rotate-1`)
- Creature image rendered as a dark engraving-style (CSS grayscale + sepia filter)
- Danger rating displayed as skull icons (☠) in blood-rust

### Full Story Page
- Narrow text column (max-w-2xl, centered)
- Aged paper background texture
- Drop-cap on first paragraph
- Decorative ink dividers between sections

---

## Out of Scope
- User accounts or authentication
- User-submitted stories
- Comments or ratings by visitors
- Search functionality (may add later)
- Live scraping at runtime
