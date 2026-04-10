# Your Nightmare — Horror Stories Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-screen interactive world map horror folklore website where users explore regions to discover supernatural stories from global mythology.

**Architecture:** Static Next.js 16 app with Tailwind v4 and TypeScript. All story content lives in `/content/stories/*.md` files parsed at build time. An interactive SVG world map (react-simple-maps) is the main UI — clicking a region navigates to its story card grid; clicking a card opens a full manuscript-style story page.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, react-simple-maps, gray-matter, remark, remark-html, Google Fonts (Cinzel + IM Fell English)

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `next.config.ts` | Modify | Add remote image patterns for Wikimedia Commons |
| `app/layout.tsx` | Modify | Replace Geist with Cinzel + IM Fell English, parchment body |
| `app/globals.css` | Modify | Parchment color palette, base typography, drop-cap, scrollbar |
| `app/page.tsx` | Modify | Full-screen world map page |
| `app/region/[slug]/page.tsx` | Create | Region story card grid with static params |
| `app/story/[slug]/page.tsx` | Create | Full manuscript story page with static params |
| `components/WorldMap.tsx` | Create | Client-side react-simple-maps interactive map |
| `components/StoryCard.tsx` | Create | Torn journal card: image, creature, teaser, rating |
| `components/DangerRating.tsx` | Create | Skull icon danger scale (1–5) |
| `components/StoryBody.tsx` | Create | Manuscript-style HTML renderer for story text |
| `lib/stories.ts` | Create | fs + gray-matter markdown parser, typed Story data |
| `lib/regions.ts` | Create | Region definitions + numeric ISO country code mapping |
| `content/stories/*.md` | Create | 25 story markdown files named by creature |
| `jest.config.ts` | Create | Jest + ts-jest config |
| `jest.setup.ts` | Create | Jest setup file |
| `__tests__/lib/regions.test.ts` | Create | Unit tests for region mapping functions |
| `__tests__/lib/stories.test.ts` | Create | Unit tests for story parsing functions |
| `__fixtures__/stories/test-creature.md` | Create | Fixture markdown for test isolation |

---

## Task 1: Install dependencies and configure Next.js

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `next.config.ts`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install react-simple-maps gray-matter remark remark-html
```

Expected: packages added to `node_modules`, `package-lock.json` updated.

- [ ] **Step 2: Install type definitions**

```bash
npm install --save-dev @types/react-simple-maps
```

Expected: no errors (if package not found, skip — react-simple-maps v3 ships its own types).

- [ ] **Step 3: Install Jest + ts-jest for data layer tests**

```bash
npm install --save-dev jest ts-jest @types/jest jest-environment-node
```

- [ ] **Step 4: Update next.config.ts to allow Wikimedia images**

Replace the contents of `next.config.ts` with:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 5: Create jest.config.ts**

```typescript
import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  setupFilesAfterFramework: [],
}

export default config
```

- [ ] **Step 6: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest"
```

- [ ] **Step 7: Verify install**

```bash
npm run build 2>&1 | head -5
```

Expected: build runs (may show default page output, no dependency errors).

- [ ] **Step 8: Commit**

```bash
git init && git add next.config.ts package.json package-lock.json jest.config.ts
git commit -m "feat: install dependencies and configure project"
```

---

## Task 2: Global styles, fonts, and Tailwind theme

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace globals.css with parchment palette and base styles**

```css
@import "tailwindcss";

@theme inline {
  --color-parchment-light: #f5e6c8;
  --color-parchment-mid: #e8d5a3;
  --color-parchment-dark: #d4b97a;
  --color-sepia-brown: #5c3d1e;
  --color-sepia-deep: #3d2510;
  --color-blood-rust: #8b2500;
  --color-near-black: #1a0f00;
  --color-amber-glow: #c4840f;
  --font-serif: var(--font-cinzel);
  --font-story: var(--font-im-fell);
}

* {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  background-color: #1a0f00;
  color: #5c3d1e;
  font-family: var(--font-im-fell), Georgia, serif;
}

/* Drop cap for story body first paragraph */
.story-body > p:first-of-type::first-letter {
  font-family: var(--font-cinzel), serif;
  font-size: 4rem;
  font-weight: 700;
  float: left;
  line-height: 0.75;
  margin-right: 0.1em;
  margin-top: 0.1em;
  color: #8b2500;
}

/* Decorative divider */
.ink-divider {
  text-align: center;
  color: #8b2500;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  margin: 2rem 0;
  opacity: 0.6;
}

/* Parchment scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #3d2510;
}
::-webkit-scrollbar-thumb {
  background: #8b6914;
  border-radius: 4px;
}
```

- [ ] **Step 2: Replace layout.tsx with Cinzel + IM Fell English fonts**

```tsx
import type { Metadata } from 'next'
import { Cinzel, IM_Fell_English } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
})

const imFell = IM_Fell_English({
  variable: '--font-im-fell',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Your Nightmare — Horror Folklore from Around the World',
  description:
    'Explore supernatural horror stories, ancient folklore, and terrifying beings from every corner of the world.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${imFell.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Run dev server to verify fonts load**

```bash
npm run dev
```

Open http://localhost:3000 — page should load without console font errors.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add parchment theme, Cinzel and IM Fell English fonts"
```

---

## Task 3: lib/regions.ts with unit tests

**Files:**
- Create: `lib/regions.ts`
- Create: `__tests__/lib/regions.test.ts`

- [ ] **Step 1: Write failing test**

Create `__tests__/lib/regions.test.ts`:

```typescript
import { getRegionBySlug, getRegionSlugByCountryCode, REGIONS } from '@/lib/regions'

describe('REGIONS', () => {
  it('has 10 regions', () => {
    expect(REGIONS).toHaveLength(10)
  })

  it('every region has a non-empty countryCodes array', () => {
    REGIONS.forEach(r => {
      expect(r.countryCodes.length).toBeGreaterThan(0)
    })
  })
})

describe('getRegionBySlug', () => {
  it('returns the region for a valid slug', () => {
    const region = getRegionBySlug('europe')
    expect(region).toBeDefined()
    expect(region!.name).toBe('Europe')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getRegionBySlug('atlantis')).toBeUndefined()
  })
})

describe('getRegionSlugByCountryCode', () => {
  it('returns north-america for USA code 840', () => {
    expect(getRegionSlugByCountryCode('840')).toBe('north-america')
  })

  it('returns europe for Germany code 276', () => {
    expect(getRegionSlugByCountryCode('276')).toBe('europe')
  })

  it('returns east-asia for Japan code 392', () => {
    expect(getRegionSlugByCountryCode('392')).toBe('east-asia')
  })

  it('returns undefined for an ocean or unknown code', () => {
    expect(getRegionSlugByCountryCode('000')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/lib/regions.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/regions'`

- [ ] **Step 3: Create lib/regions.ts**

```typescript
export interface Region {
  name: string
  slug: string
  countryCodes: string[] // Numeric ISO 3166-1 codes as strings
}

export const REGIONS: Region[] = [
  {
    name: 'North America',
    slug: 'north-america',
    countryCodes: [
      '840', '124', '484', '320', '84', '340', '222', '558', '188', '591',
      '192', '388', '332', '214', '44', '780', '659', '662', '670', '28',
      '52', '212', '308', '630',
    ],
  },
  {
    name: 'South America',
    slug: 'south-america',
    countryCodes: [
      '76', '32', '170', '604', '862', '152', '218', '68', '600', '858',
      '328', '740', '254',
    ],
  },
  {
    name: 'Europe',
    slug: 'europe',
    countryCodes: [
      '276', '250', '826', '724', '380', '616', '528', '56', '756', '40',
      '620', '752', '578', '208', '246', '300', '642', '348', '203', '703',
      '100', '191', '688', '70', '807', '8', '499', '705', '428', '440',
      '233', '112', '804', '498', '352', '372', '442', '438', '674', '336',
      '470', '196', '20', '492', '643',
    ],
  },
  {
    name: 'Africa',
    slug: 'africa',
    countryCodes: [
      '566', '231', '818', '180', '710', '834', '404', '12', '729', '800',
      '508', '288', '450', '120', '384', '562', '466', '24', '854', '894',
      '454', '716', '686', '148', '706', '324', '646', '204', '788', '108',
      '728', '768', '694', '434', '140', '430', '478', '232', '516', '270',
      '72', '266', '426', '624', '226', '480', '748', '262', '174', '132',
      '678',
    ],
  },
  {
    name: 'Middle East',
    slug: 'middle-east',
    countryCodes: [
      '682', '364', '368', '792', '887', '760', '400', '784', '376', '422',
      '512', '414', '634', '48', '275', '4', '586', '398', '860', '795',
      '417', '762', '31', '51', '268',
    ],
  },
  {
    name: 'East Asia',
    slug: 'east-asia',
    countryCodes: ['156', '392', '408', '410', '496', '158'],
  },
  {
    name: 'Southeast Asia',
    slug: 'southeast-asia',
    countryCodes: ['360', '764', '704', '458', '608', '104', '116', '418', '702', '96', '626'],
  },
  {
    name: 'South Asia',
    slug: 'south-asia',
    countryCodes: ['356', '50', '524', '144', '462', '64'],
  },
  {
    name: 'Oceania',
    slug: 'oceania',
    countryCodes: [
      '36', '554', '598', '242', '90', '548', '882', '776', '583', '585',
      '584', '296', '520', '798',
    ],
  },
  {
    name: 'Arctic & Siberia',
    slug: 'arctic-siberia',
    countryCodes: ['304'],
  },
]

// Build a lookup map for O(1) access
const countryToRegion = new Map<string, string>()
for (const region of REGIONS) {
  for (const code of region.countryCodes) {
    countryToRegion.set(code, region.slug)
  }
}

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find(r => r.slug === slug)
}

export function getRegionSlugByCountryCode(code: string): string | undefined {
  return countryToRegion.get(code)
}
```

> Note: Russia (643) is listed under Europe to cover the western part. It will visually cover both Europe and the Siberian landmass on the map. This is a simplification — the Arctic/Siberia region uses Greenland (304) as its representative clickable territory.

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest __tests__/lib/regions.test.ts
```

Expected: PASS (4 test suites, all green)

- [ ] **Step 5: Commit**

```bash
git add lib/regions.ts __tests__/lib/regions.test.ts
git commit -m "feat: add regions data layer with country code mapping"
```

---

## Task 4: lib/stories.ts with unit tests

**Files:**
- Create: `lib/stories.ts`
- Create: `__fixtures__/stories/test-creature.md`
- Create: `__tests__/lib/stories.test.ts`

- [ ] **Step 1: Create fixture markdown file**

Create `__fixtures__/stories/test-creature.md`:

```markdown
---
title: "The Test Creature"
creature: "Test Creature"
region: "Test Region"
regionSlug: "test-region"
category: "Folklore"
dangerRating: 3
teaser: "A terrifying being from the test realm."
image: "https://upload.wikimedia.org/wikipedia/commons/test.jpg"
---

This is the story of the test creature. It roams the test realm at night.

Paragraph two of the test creature's tale.
```

- [ ] **Step 2: Write failing test**

Create `__tests__/lib/stories.test.ts`:

```typescript
import path from 'path'
import { getAllStories, getStoriesByRegion, getStoryBySlug } from '@/lib/stories'

// Override the stories directory to point at our fixture
jest.mock('path', () => {
  const actual = jest.requireActual<typeof path>('path')
  return {
    ...actual,
    join: (...args: string[]) => {
      // Redirect content/stories calls to __fixtures__/stories
      const joined = actual.join(...args)
      if (joined.includes('content/stories')) {
        return joined.replace('content/stories', '__fixtures__/stories')
      }
      return joined
    },
  }
})

describe('getAllStories', () => {
  it('returns an array of stories', () => {
    const stories = getAllStories()
    expect(Array.isArray(stories)).toBe(true)
    expect(stories.length).toBeGreaterThan(0)
  })

  it('each story has required fields', () => {
    const stories = getAllStories()
    const story = stories[0]
    expect(story.slug).toBe('test-creature')
    expect(story.title).toBe('The Test Creature')
    expect(story.creature).toBe('Test Creature')
    expect(story.regionSlug).toBe('test-region')
    expect(story.dangerRating).toBe(3)
    expect(typeof story.teaser).toBe('string')
  })
})

describe('getStoriesByRegion', () => {
  it('returns stories matching the region slug', () => {
    const stories = getStoriesByRegion('test-region')
    expect(stories).toHaveLength(1)
    expect(stories[0].slug).toBe('test-creature')
  })

  it('returns empty array for unknown region', () => {
    expect(getStoriesByRegion('atlantis')).toHaveLength(0)
  })
})

describe('getStoryBySlug', () => {
  it('returns the story with parsed HTML content', async () => {
    const story = await getStoryBySlug('test-creature')
    expect(story.slug).toBe('test-creature')
    expect(story.contentHtml).toContain('<p>')
    expect(story.contentHtml).toContain('test creature')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npx jest __tests__/lib/stories.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/stories'`

- [ ] **Step 4: Create lib/stories.ts**

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export interface Story {
  slug: string
  title: string
  creature: string
  region: string
  regionSlug: string
  category: string
  dangerRating: number // 1–5
  teaser: string
  image: string
  contentHtml: string
}

const storiesDir = path.join(process.cwd(), 'content/stories')

function parseStoryFile(fileName: string): Omit<Story, 'contentHtml'> {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(storiesDir, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)
  return {
    slug,
    title: data.title as string,
    creature: data.creature as string,
    region: data.region as string,
    regionSlug: data.regionSlug as string,
    category: data.category as string,
    dangerRating: data.dangerRating as number,
    teaser: data.teaser as string,
    image: data.image as string,
  }
}

export function getAllStories(): Omit<Story, 'contentHtml'>[] {
  const fileNames = fs.readdirSync(storiesDir)
  return fileNames
    .filter(f => f.endsWith('.md'))
    .map(parseStoryFile)
}

export function getStoriesByRegion(
  regionSlug: string,
): Omit<Story, 'contentHtml'>[] {
  return getAllStories().filter(s => s.regionSlug === regionSlug)
}

export async function getStoryBySlug(slug: string): Promise<Story> {
  const fullPath = path.join(storiesDir, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const processed = await remark().use(html).process(content)
  return {
    slug,
    title: data.title as string,
    creature: data.creature as string,
    region: data.region as string,
    regionSlug: data.regionSlug as string,
    category: data.category as string,
    dangerRating: data.dangerRating as number,
    teaser: data.teaser as string,
    image: data.image as string,
    contentHtml: processed.toString(),
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx jest __tests__/lib/stories.test.ts
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add lib/stories.ts __fixtures__/stories/test-creature.md __tests__/lib/stories.test.ts
git commit -m "feat: add stories data layer with markdown parsing"
```

---

## Task 5: Create all 25 story markdown files

**Files:**
- Create: `content/stories/*.md` (25 files)

Create the directory first:
```bash
mkdir -p content/stories
```

Then create each file. The frontmatter must match the schema exactly. Story body text should be 3–5 paragraphs of atmospheric, folklore-accurate prose.

- [ ] **Step 1: Create North America stories**

`content/stories/wendigo.md`:
```markdown
---
title: "The Wendigo"
creature: "Wendigo"
region: "North America"
regionSlug: "north-america"
category: "Ancient Creature"
dangerRating: 5
teaser: "A ravenous spirit of the frozen north, born from cannibalism and insatiable hunger — once touched by its curse, you will never be full again."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Wendigo_by_Morby.jpg/640px-Wendigo_by_Morby.jpg"
---

Deep in the boreal forests of the Algonquian peoples, where winter stretches on without mercy and the cold gnaws at the bones of the living, there stalks a creature older than memory. The Wendigo was not always a monster. It began as a man — a man who, driven to the edge of starvation, committed the unthinkable act of consuming human flesh. In that moment of weakness, something ancient and hungry slipped inside him and made itself at home.

The transformation is slow but absolute. The Wendigo grows to enormous height, its skin drawn tight over a skeletal frame, lips pulled back from yellowed teeth, eyes sunken and burning with a cold blue light. It is always hungry. No matter how many it devours, the hunger is never satisfied — it can only grow. The Algonquian people say the creature's heart is made of ice, and that is why it can never be warmed, never be filled, never be saved.

To encounter a Wendigo in the forest is to know pure dread. It moves silently through the snow, leaving no tracks. Its breath smells of decay and frozen meat. Shamans who have faced it say its cry is like the sound of the wind screaming through a hollow tree — a sound that reaches into you and pulls out the worst hunger you have ever known.

There is another form of the curse: Wendigo psychosis. A person consumed by guilt, isolation, or starvation can become one without ever eating flesh. The hunger begins in the mind — a craving for things that cannot be named. Those who succumb are said to weep constantly, begging to be killed before the transformation completes, knowing what they are about to become.

The shamans kept axes made of cold iron for this purpose. The only way to kill a Wendigo is to melt its frozen heart, or to burn the body completely — for even a fragment of bone, left in the snow, can reconstitute the thing that was destroyed.
```

`content/stories/skinwalker.md`:
```markdown
---
title: "The Skinwalker"
creature: "Skinwalker"
region: "North America"
regionSlug: "north-america"
category: "Shapeshifter"
dangerRating: 5
teaser: "A Navajo witch who has shed their humanity to wear the skins of animals — and sometimes, the faces of people you love."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Navajo_sand_painting.jpg/640px-Navajo_sand_painting.jpg"
---

Among the Navajo people, there are certain things you do not speak of by daylight, and certain things you do not speak of at all. The yee naaldlooshii — translated loosely as "with it, he goes on all fours" — is one of them. Even mentioning the creature is said to draw its attention, and its attention is not something anyone desires.

The Skinwalker is a medicine man or woman who has turned away from healing and chosen the darkest path available to them: the donning of an animal's skin to steal its nature entirely. They must commit an act of profound taboo — the killing of a close family member — to gain their power. Once the threshold is crossed, they can take any animal's form: wolf, coyote, crow, bear. They move with impossible speed, cover distances in minutes that would take hours on foot.

But what makes the Skinwalker truly terrifying is what it can do with human faces. If it locks eyes with you for long enough, it can take your appearance. People have returned home to find their own face already there, sitting at the table, speaking to their family in their own voice. The impersonation is nearly perfect. Nearly.

Eyewitnesses describe the wrongness before they can articulate it — a husband who blinks too slowly, a mother who tilts her head at an unnatural angle, a child who doesn't seem to recognize objects they've handled for years. The Skinwalker learns the surface of a person perfectly but cannot inhabit the depth.

If you are followed by one, do not look back. Do not speak its name. Throw a handful of corn pollen in the direction it came from. And if you find yourself staring into the eyes of someone you love and feeling a cold certainty that they are not there — run. Do not engage it, do not confront it, do not give it your name. A name, spoken to a Skinwalker, is a key that opens every door.
```

- [ ] **Step 2: Create South America stories**

`content/stories/la-llorona.md`:
```markdown
---
title: "La Llorona"
creature: "La Llorona"
region: "South America"
regionSlug: "south-america"
category: "Ghost/Spirit"
dangerRating: 4
teaser: "The Weeping Woman drifts along the waterways of Latin America, wailing for the children she drowned — and looking for replacements."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/La_Llorona_by_John_Spencer.jpg/640px-La_Llorona_by_John_Spencer.jpg"
---

She is always found near water. Rivers, canals, the edges of lakes at midnight — wherever the current runs dark and quiet, La Llorona is never far behind. Her wail is distinctive: not the generic keening of a ghost, but something specific and hollow, a mother's cry stripped of hope, repeated endlessly into the dark like a prayer no one will answer.

The story varies by region but the bones are consistent. She was a beautiful woman, perhaps of indigenous blood, who fell in love with a wealthy man who would not claim her children as his own. In grief and rage — some versions say madness, some say calculated punishment — she drowned them. The moment they were gone, she understood what she had done. She wept herself to death on the riverbank.

Death did not quiet her. She wanders now in a white dress that was once a wedding gown, her face hidden by long wet hair or drawn back in agony, depending on the night. She searches for her children. She does not find them. Her grief has curdled into something that lashes out — she has been known to take children who wander near the water at night, mistaking them, or perhaps no longer caring about the distinction.

Parents in Mexico, Guatemala, Colombia, and far beyond tell their children: if you hear a woman crying near the water at night, come inside immediately. If the crying seems to be moving closer but there is no figure visible, do not wait to see it. If you see a woman in white standing near the water's edge and she turns to look at you — run, and do not look back at her face.

Some say she can be placated with prayer. Others say the only protection is to be nowhere near water when the moon is new and the world is at its darkest.
```

`content/stories/curupira.md`:
```markdown
---
title: "The Curupira"
creature: "Curupira"
region: "South America"
regionSlug: "south-america"
category: "Supernatural Being"
dangerRating: 3
teaser: "A fiery-haired guardian of the Amazon whose feet point backward — leading hunters deeper into the jungle until they are hopelessly lost."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Curupira.jpg/640px-Curupira.jpg"
---

The Curupira does not want to kill you. It wants you to suffer the particular horror of realizing you are lost — truly, irretrievably lost — in a jungle the size of a continent. And then it wants to watch you panic.

This creature of Brazilian and Tupi mythology is the jungle's immune system, a supernatural guardian of the forest who has no tolerance for those who take more than they need. It takes the form of a small wild child with blazing red or orange hair, skin the color of dark earth, and feet that are attached backward — heels forward, toes pointing behind. When it runs, every footprint suggests it is moving in the opposite direction.

A hunter who follows Curupira tracks finds that no matter how logically they navigate, the forest rearranges itself. They will walk for hours and arrive where they started. They will climb a ridge they've climbed a dozen times and find themselves looking at country they have never seen. The sounds of the village they left that morning will echo from every direction at once. By the time they understand what has happened to them, disorientation has become something closer to madness.

The Curupira is not without rules. It specifically targets those who hunt for sport or waste — those who kill pregnant animals, who cut trees without need, who take from the forest carelessly. A hunter who kills only what is needed and thanks the forest for its gift may pass through Curupira territory without incident, and may even receive a kind of protection.

Leave tobacco at the base of an old tree before you enter the deep jungle. Move carefully. Take only what you came for. The Curupira is always watching, always counting.
```

- [ ] **Step 3: Create Europe stories**

`content/stories/banshee.md`:
```markdown
---
title: "The Banshee"
creature: "Banshee"
region: "Europe"
regionSlug: "europe"
category: "Ghost/Spirit"
dangerRating: 3
teaser: "Her wail does not cause death — it announces it. If you hear the Banshee keening outside your window, someone in your family will not see morning."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Banshee.jpg/640px-Banshee.jpg"
---

In Ireland, death does not always arrive unannounced. Sometimes it sends a herald. The bean sídhe — woman of the fairy mound — appears at the moment a member of one of the ancient Irish families is about to die. Her function is not to kill but to mourn, and her mourning is a sound that no living person who has heard it can forget or fully describe.

She appears most often as an old woman in rags, her long white hair loose around a face ravaged by grief. Sometimes she appears as a young woman of heartbreaking beauty, which is somehow more terrible. She sits outside the home of the doomed, or at the edge of the river, combing her hair with a silver comb and wailing — a cry that has been compared to every terrible thing at once: a screaming child, a mournful wind, a woman in the last stages of unbearable loss.

The sound passes through walls. It passes through sleep. People have described being woken by it and lying completely still, knowing without knowing how that they should not get up, should not go to the window, should not confirm what they already understand. Those who have looked say she looks directly at them without surprise, as if she knew they would look, as if she was waiting for them to understand what she was telling them.

She is attached to specific family lines — the O'Neills, the O'Briens, the O'Connors, the O'Gradys, the Kavanaghs. If your name carries one of these bloodlines, the Banshee is yours whether you want her or not. She has followed families across oceans to America, to Australia, to wherever the blood went. Distance means nothing to her loyalty.

The silver comb she carries is important. If you find one near your door or on a windowsill and you pick it up, you have taken her possession. She will come to reclaim it that night, and she will be less mournful than usual.
```

`content/stories/strigoi.md`:
```markdown
---
title: "The Strigoi"
creature: "Strigoi"
region: "Europe"
regionSlug: "europe"
category: "Cursed Human"
dangerRating: 5
teaser: "Romania's true vampire — not the romantic creature of fiction, but a dead thing that rises to drink from its own family first."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Romanian_vampire.jpg/640px-Romanian_vampire.jpg"
---

The vampire of Bram Stoker came from somewhere, and that somewhere is the Romanian countryside, where the strigoi has been feared for centuries not as a gothic aristocrat but as a neighbor, a relative, a grandmother who died wrong and came back hungry. There is nothing romantic about it. It is a corpse that will not stay dead, and its first instinct is to return to the people who loved it most.

The strigoi is created in several ways: dying without receiving last rites, dying by suicide, being born with a caul, being the seventh child of a seventh child, or — most dreaded — being bitten by another strigoi. When the creature rises, it looks like the person who died. The face is familiar. The voice is familiar. It will knock at your door and call you by the pet names only family would know. This is by design. The strigoi feeds most easily on those who open the door.

Once inside, it does not kill quickly. It drains slowly — returning night after night, leaving the family wasting and pale while appearing to those outside as merely grieving. The entire household may follow the first victim into death before neighbors understand what is happening.

The traditional remedy is brutal and specific. The body must be disinterred. If the corpse shows signs of life — color in the cheeks, blood at the lips, a body that has not decayed — the heart must be removed and burned or pierced with a stake of iron or ash. In some regions, the head is removed and placed between the legs. The grave is then filled with garlic and the site salted. These are not superstitions. To the Romanian villagers who developed them, they were empirically derived procedures — things that had been tested and found to work.

If you hear knocking at your door after a recent death in the family, do not open it. Not for any voice you recognize. Not for any name you have not spoken aloud since the funeral.
```

`content/stories/baba-yaga.md`:
```markdown
---
title: "Baba Yaga"
creature: "Baba Yaga"
region: "Europe"
regionSlug: "europe"
category: "Supernatural Being"
dangerRating: 4
teaser: "She flies in a mortar, her hut spins on chicken legs, and she may help you or eat you — she has not yet decided."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Bilibin_Baba_Yaga.jpg/640px-Bilibin_Baba_Yaga.jpg"
---

Deep in the Russian forest — always deeper than you think the forest goes, always past the point where sensible people turn back — there is a hut that stands on two enormous chicken legs. It has no windows facing the forest path, only a blank wall of old timber. It rotates. It knows when you are coming.

Baba Yaga is the old woman inside it, and she is neither fully good nor fully evil, which makes her more terrifying than either. She is ancient beyond reckoning — her nose brushes the ceiling when she lies on her stove, her iron teeth click when she speaks, and she smells arrivals before she sees them. She flies in a mortar, propelling herself with a pestle, sweeping away her tracks with a broom. Night, Day, and the Red Sun are her servants and ride for her when she calls them.

She has specific customs, and if you observe them, you have a chance. Anyone who arrives at her hut must be given food and a bath and a bed before she asks their business — this is the old law of hospitality, and even she cannot break it. She will ask whether you have come of your own will or been sent by another. Your answer matters enormously. She may then set you tasks. Complete them and she gives you what you came for. Fail and she eats you.

The critical rule: do not ask too many questions. Baba Yaga herself once told a girl who asked too much that "curiosity killed the good fellow" — and then demonstrated the point. She is not cruel for cruelty's sake; she is a force of the forest, a gatekeeper between the world of the living and the world of the dead. Many seekers find her on the edge of that border, about to pass through it.

Heroes in the old stories go to her because they have no choice. She knows everything. She has lived long enough to have seen the thing you're looking for, to know its weakness, to have it in a box in the corner. Whether she will tell you costs something different each time.
```

`content/stories/nuckelavee.md`:
```markdown
---
title: "The Nuckelavee"
creature: "Nuckelavee"
region: "Europe"
regionSlug: "europe"
category: "Ancient Creature"
dangerRating: 5
teaser: "From the sea of the Orkney Islands rises a creature with no skin — only wet muscle and black blood pumping through exposed veins, mounted on a horse that is not a horse."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Nuckelavee.jpg/640px-Nuckelavee.jpg"
---

The Orcadians had many sea-spirits to fear, but none inspired the particular paralysis of dread that the Nuckelavee did. When fishermen and farmers of the Orkney Islands spoke of it — always in hushed tones, never by the fire at night — they described something that seemed designed specifically to break the human mind's capacity for processing horror.

It comes from the sea. The thing is enormous — twice the size of the largest horse — and it appears first as a mounted figure emerging from the water at night. Then you see that the horse and rider are one creature, joined at the torso, sharing a single pair of lungs that inflate and deflate through exposed ribs. Neither horse nor rider has any skin at all. The black blood moves visibly through yellow veins. The muscles are wet and glistening. Where the horse's head should be, there is instead a single enormous eye, and it burns like coal.

Its breath is pestilence. Where the Nuckelavee passes, crops wither. Livestock die on their feet. Wells go foul. During the 19th century, a particularly severe crop blight in the Orkneys was attributed to the Nuckelavee having come ashore more than usual that season.

The only defense the old people knew was fresh water. The Nuckelavee cannot cross a stream — it will not, or perhaps cannot. If you are pursued, a stream of running water between you and it breaks the chase. Sea water doesn't work; it lives in the sea. The water must come from rain or spring, from inland, from the sky.

Those who have seen it and survived describe the wrongness of it not as fear but as a total revision of what they thought the world contained. The body processes it as something that should not exist, cannot exist, has no right to exist. And yet there it is, watching you from that burning eye, breathing its ruin into the air.
```

- [ ] **Step 4: Create Africa stories**

`content/stories/popobawa.md`:
```markdown
---
title: "The Popobawa"
creature: "Popobawa"
region: "Africa"
regionSlug: "africa"
category: "Demon"
dangerRating: 4
teaser: "A shape-shifting demon from Zanzibar that visits homes at night, smelling of sulfur — and it demands you tell others about it, or it will return."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Zanzibar_coast.jpg/640px-Zanzibar_coast.jpg"
---

The Popobawa first appeared in Zanzibar in 1965, the year the islands joined Tanzania, though older people say it had been present much longer under different names. It is a shape-shifter — sometimes it appears as a one-eyed bat-winged demon, sometimes as a shadow without a source, sometimes as a smell of sulfur that precedes nothing visible. It attacks at night. It targets households where people refuse to believe in it.

What makes the Popobawa unique among supernatural beings is its social dimension. After a visitation, it instructs its victims to tell their neighbors what happened. If the victim stays silent out of shame, it will return. This creates a social cascade — people speak about it to prevent recurrence, and the speaking spreads awareness, which the creature seems to feed on. During the major Popobawa panics of 1995 and 2007, entire neighborhoods in Zanzibar stayed awake through the night, families huddled together outside their homes, believing that the creature could not attack groups.

Skeptics have offered explanations — sleep paralysis, collective hysteria, political manipulation — but these satisfy no one who has been in a village at 3 AM when the smell of sulfur moves through the air and the goats go silent simultaneously. The Popobawa does not respect modern categories.

The use of smearing pig fat on one's body before sleep was considered protective in some communities. Reciting verses from the Quran was another measure. But the most reliable protection, according to the people who live with this knowledge, is the same instruction the creature gives itself: speak. Do not try to contain it with silence. That silence is exactly what it wants.
```

`content/stories/tokoloshe.md`:
```markdown
---
title: "The Tokoloshe"
creature: "Tokoloshe"
region: "Africa"
regionSlug: "africa"
category: "Supernatural Being"
dangerRating: 4
teaser: "A small, hairy water spirit from Zulu tradition that can be sent by an enemy to torment or kill you — and you'll never see it coming."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Zulu_traditional_healer.jpg/640px-Zulu_traditional_healer.jpg"
---

In Zulu and Xhosa tradition, the Tokoloshe (also known as Tikoloshe) is a small, hairy humanoid spirit with a particularly sinister characteristic: it can make itself invisible by swallowing a pebble, and it can shrink itself to the size of a child. It lives near rivers and streams, and it can be summoned and directed by a witch or sorcerer to torment a specific person.

The creature can cause illness, create nightmares so vivid the victim cannot distinguish them from reality, and in worst cases, carry the soul away entirely. When someone falls into a mysterious illness — declining without obvious cause, wasting despite eating, plagued by terrible dreams that leave physical marks — the community's first question is: who sent the Tokoloshe, and why?

There is a well-known practical measure still used across South Africa today: raise your bed on bricks. The Tokoloshe is small and cannot climb, and if your bed is elevated sufficiently, it cannot reach you in your sleep. This is not a joke or a tourist curiosity — it is a living practice, visible in townships and rural communities both. The bricks under the bed legs are as ordinary a precaution as a lock on the door.

The witch who sends a Tokoloshe must be found and confronted through the assistance of a sangoma — a traditional healer who can identify the source and negotiate or force the spirit's withdrawal. This is serious business, not casual accusation. The identification of a witch is a matter of community justice, and the consequences of false accusation are severe.

The Tokoloshe cannot be seen by adults under most circumstances, but children can see it. If your child points at empty space in a room and goes pale, this is not imagination.
```

`content/stories/abiku.md`:
```markdown
---
title: "The Abiku"
creature: "Abiku"
region: "Africa"
regionSlug: "africa"
category: "Supernatural Being"
dangerRating: 3
teaser: "A Yoruba spirit child that is born, dies young, and is reborn to the same mother — cycling endlessly unless the cycle is broken."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Yoruba_art.jpg/640px-Yoruba_art.jpg"
---

In Yoruba cosmology of West Africa, some children are not truly children at all — they are abiku, spirit-children who belong to a company of supernatural beings and have only agreed to visit the world of the living temporarily. They are born, they charm their families with uncommon beauty and intelligence, and then they die before adolescence. Their death is not tragedy so much as departure — they have simply returned to where they came from.

The true horror of the abiku is what comes after. The same spirit is reborn to the same mother. The cycle repeats. A family may bury three, four, five children with the same face, the same unusual gifts, the same early departure. The grief is compounded by the knowledge that you are being used — that this beautiful child who laughs in your lap has already decided when it is leaving and does not consider your attachment.

The Yoruba response is not passive. Ritual specialists called babalawos work to convince the spirit-child to stay, bargaining with it in ceremonies that address it directly as what it is. Iron anklets engraved with binding words are placed on the child to make leaving harder. Scarification marks the body so the spirit can be recognized if it returns — shaming it in front of its companions in the spirit world.

Wole Soyinka's poem "Abiku" captures the creature's voice with chilling accuracy: the spirit speaks of its own returns without remorse, almost curious about the grief it causes, unable to understand why the living hold on so hard to something that was never entirely theirs.

Some children designated abiku grow up entirely normal. The ritual worked, or the spirit changed its mind, or it was never abiku at all. No one ever knows which.
```

- [ ] **Step 5: Create Middle East stories**

`content/stories/djinn.md`:
```markdown
---
title: "The Djinn"
creature: "Djinn"
region: "Middle East"
regionSlug: "middle-east"
category: "Supernatural Being"
dangerRating: 4
teaser: "Created from smokeless fire, the Djinn are a race parallel to humanity — some benevolent, some malicious, some ancient beyond all reckoning."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Jinn_with_human.jpg/640px-Jinn_with_human.jpg"
---

Before the Quran named them, the Djinn already existed. They are mentioned in Islamic scripture as a created race — made from smokeless fire as humans were made from clay — who were given free will and who, like humans, can choose faith or rejection. They have their own communities, their own families, their own mosques. They live in parallel to the human world, occupying the same spaces but in a dimension slightly displaced from ours.

There are several categories of djinn, ranging from the mostly harmless to the deeply dangerous. The Ifrit are among the most powerful — ancient beings of enormous strength and will who have accumulated centuries of knowledge and grievance. The Marid are associated with water and the sea. The Si'la are shape-shifters. The Qareen is the djinn assigned to each human at birth, a shadow companion that knows every sin you have committed and will testify against you if called upon.

Human interactions with djinn go wrong in predictable ways. Someone unknowingly builds a home on a djinn dwelling and wonders why the family cannot sleep, why objects move, why one child has fallen into unexplained illness. A person who urinates on the ground without saying the prescribed words of protection — warning the djinn of their presence — may be punished for the disrespect. Abandoned places: ruins, empty lots, crossroads at midnight — these are djinn gathering places, and the curious human who lingers there alone has arrived uninvited.

Iron repels most djinn. Recitation of specific Quranic verses disrupts their presence. Salt is protective. But the most important thing is awareness: the djinn world is adjacent to yours at every moment, and most djinn have no particular interest in humans unless provoked. Provocation, however, takes many forms — and some djinn remember slights across generations.

If you find yourself in a place that feels occupied — that particular weight in the air, the sense of being watched without visible observer — leave quietly and do not look back. You have wandered into someone else's home.
```

`content/stories/ghoul.md`:
```markdown
---
title: "The Ghoul"
creature: "Ghoul"
region: "Middle East"
regionSlug: "middle-east"
category: "Demon"
dangerRating: 4
teaser: "A desert shapeshifter that lurks in graveyards and lonely places, luring travelers to their deaths before feasting on the dead."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Arabian_night.jpg/640px-Arabian_night.jpg"
---

In pre-Islamic Arabian tradition and throughout the world of One Thousand and One Nights, the ghoul haunts the places between places — the desert wastes, the necropolis at the edge of the city, the crossroads that no one uses after dark. It is a creature of transformation and appetite, and its primary trait is that it will wear whatever face gets it what it wants.

The ghoul most often appears as a beautiful woman or a fellow traveler to lure a lone desert-crosser away from safety. The transformation happens in stages: first the face, then the voice, then the details that a careful observer would notice — the hands are wrong, the shadow falls in the wrong direction, the reflection in the water shows something different from what stands above it. By the time the traveler understands, they are far from the road.

It feeds primarily on corpses, which is why it haunts graveyards and battlefields — these places are its pantry. It has no preference for fresh kills, though it will make them if necessary. The specific horror of the ghoul is that death is not the end of the indignity it inflicts; it comes for you after you are buried.

Iron is the primary defense, particularly iron that has been touched by fire. Calling the creature by name — acknowledging it directly — is said to rob it of some of its power over you, though this should only be attempted in broad daylight. At night, naming summons.

The shape-shifting is the ghoul's greatest weapon and its only limitation: it cannot take the form of something it has never seen. Travelers who encountered them in the old stories and survived usually did so by showing the ghoul something unfamiliar, something it had no reference for — buying time to reach shelter or strike with whatever iron they carried.
```

`content/stories/ammit.md`:
```markdown
---
title: "Ammit"
creature: "Ammit"
region: "Middle East"
regionSlug: "middle-east"
category: "Deity"
dangerRating: 5
teaser: "The Devourer of the Dead — part lion, part hippo, part crocodile — waits beside the scales of judgment in the Egyptian underworld to eat the hearts found unworthy."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/BD_Weighing_of_the_Heart.jpg/640px-BD_Weighing_of_the_Heart.jpg"
---

In the Hall of Two Truths, deep in the Egyptian Duat — the underworld — the dead stand before the scales. On one pan rests the feather of Ma'at, the feather of truth and cosmic order. On the other pan rests the dead person's heart, in which every deed, every thought, every moment of their life has been recorded. Anubis holds the scales. Thoth records the result. And in the corner, waiting, crouches Ammit.

Ammit is a composite: the head of a crocodile, the forequarters of a lion or leopard, the hindquarters of a hippopotamus. These were the three most dangerous animals known to the ancient Egyptians, and she is all three. She has no role in the judgment itself — she does not weigh, she does not decide. She simply waits. And when a heart is found too heavy, when a life has accumulated too much wrongdoing, when the scales tip against you — Ammit is there.

She eats the heart. This is the second death, and it is final. To be eaten by Ammit is to be erased completely — no afterlife, no memory, no continuation of any kind. The Egyptians called this the "second death," and it was the thing they feared above all. Their elaborate funerary rituals, their Books of the Dead filled with spells and confessions, their heart scarabs inscribed with pleas not to testify against their owners — all of it was designed to avoid ending in Ammit's jaws.

What is remarkable about Ammit is that she is not evil. She is a necessary function. She is the universe's accounting, the consequence of a life poorly lived made concrete and immediate. She does not want to eat your heart. She simply will, if the scales say so.

The Egyptians called her Ammit the Devourer, Ammit the Bone-Eater, Ammit Who Eats the Dead. They did not worship her. You do not worship the thing that erases you. You simply try, with everything you have, not to meet her.
```

- [ ] **Step 6: Create East Asia stories**

`content/stories/kuchisake-onna.md`:
```markdown
---
title: "Kuchisake-onna"
creature: "Kuchisake-onna"
region: "East Asia"
regionSlug: "east-asia"
category: "Cursed Human"
dangerRating: 4
teaser: "The Slit-Mouthed Woman approaches you on an empty street, wearing a surgical mask. Then she asks: am I beautiful?"
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kuchisake-onna.jpg/640px-Kuchisake-onna.jpg"
---

You are walking home alone at night — late, the streets empty — when a woman appears ahead of you. She is dressed well, perhaps elegantly. She wears a surgical mask over the lower half of her face, which is not unusual in Japan, where masks are worn for health and courtesy. She approaches you and stops. She is, you notice, very beautiful above the mask.

She asks: "Am I beautiful?" (Watashi, kirei?)

There is no good answer.

If you say no, she produces scissors from her coat and kills you where you stand. If you say yes, she removes the mask, revealing a mouth that has been slit from ear to ear — either by surgery, by violence, or by something that precedes both explanations. She asks again: "Am I beautiful now?" If you say no this time, she kills you. If you say yes, she follows you home and kills you there.

The only escapes the folklore offers are specific and counterintuitive: give an ambiguous answer ("you are average," "so-so"), throw candy or coins to distract her, or — in some versions — answer the second question with a question that confuses her logic: "Do I think you are beautiful?" This gives you time to run.

The legend has a backstory, though it varies. Most versions involve a woman disfigured by a jealous or violent husband, or a botched cosmetic procedure. She died in grief or rage. What she became is something that cannot be consoled. The question she asks is not about vanity — it is a test she has already determined no one can pass, a loop of pain she cannot exit.

The story exploded in Japan in 1979 when schools began dismissing students early over reported sightings, police received hundreds of calls, and the country experienced something very close to a nationwide panic about a woman with scissors who was not there — or was.
```

`content/stories/yuki-onna.md`:
```markdown
---
title: "Yuki-onna"
creature: "Yuki-onna"
region: "East Asia"
regionSlug: "east-asia"
category: "Ghost/Spirit"
dangerRating: 3
teaser: "The Snow Woman appears to travelers lost in blizzards — breathtakingly beautiful, breathtakingly cold, and she decides in that moment whether you live or die."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Yuki-onna.jpg/640px-Yuki-onna.jpg"
---

She appears in blizzards, when the world has gone white and silent and the cold has passed from discomfort into danger. She is tall, with long black hair against skin as white as the snow she moves through. Her kimono is white. Her breath is visible even in the freezing air. She does not leave footprints.

Yuki-onna — the Snow Woman — is a figure from Japanese folklore with a will that seems genuinely ambivalent. Some accounts show her killing travelers by breathing on them, drawing out their warmth until they freeze where they stand, sometimes carrying children away into the cold. Other accounts show her helping lost travelers, appearing to lead them back to a road, disappearing when they are safe. What determines which encounter you receive is unclear, and may have no consistent logic.

The most famous literary account is Lafcadio Hearn's version, in which a woodcutter named Mosaku encounters her and she spares him after killing his companion — on the condition that he never speaks of seeing her. Years later he marries a woman named O-Yuki and tells her the story of what happened in the snow. O-Yuki is Yuki-onna. She spares him again because of the children they have together, but she vanishes into the cold, and he spends the rest of his life wondering whether the beauty beside him was ever entirely present or always preparing to leave.

The danger of Yuki-onna is not only physical. There are accounts of men who survived her touch and were found wandering in summer, in warm weather, still shivering — as if she had taken something from the inside that no heat could replace. A piece of them had gone with her into the snow, and they spent the rest of their lives trying to get it back.
```

`content/stories/gashadokuro.md`:
```markdown
---
title: "Gashadokuro"
creature: "Gashadokuro"
region: "East Asia"
regionSlug: "east-asia"
category: "Ghost/Spirit"
dangerRating: 5
teaser: "A giant skeleton formed from the grudge-filled bones of soldiers who starved to death — it wanders at night, biting off heads and drinking the blood."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Gashadokuro.jpg/640px-Gashadokuro.jpg"
---

When soldiers die far from home in battle — not from wounds but from starvation, from abandonment, from the mundane cruelty of a war that forgot them — their bones do not rest. The rage and hunger that filled their last days accumulates in the earth where they fell, and eventually, when enough bones have gathered enough grudge, they rise.

The Gashadokuro is enormous — fifteen times the height of a man, according to the old descriptions. It is a skeleton, but not the skeleton of a single person. It is assembled from thousands of them, fused together by the collected resentment of men who died wrongly. It wanders roads and fields between midnight and dawn, making a sound described as a ringing in the ears — the sound of teeth clicking together, amplified to something that can be felt in the chest.

If you are alone on a road at night and your ears begin to ring without apparent cause, the old advice is to stop walking and look around you carefully. The Gashadokuro is invisible until it has decided to act. When it acts, it bites. It takes heads whole and drinks the blood from the severed neck. This is not violence for its own sake — it is hunger, the posthumous continuation of the starvation that created it.

There is no killing it. You cannot destroy something that is already dead and has already been through worse than anything you can offer it. The only protection is a shimenawa — a sacred rope woven with paper strips used in Shinto practice — carried on your person. The holy object creates a boundary the creature cannot cross. Without it, if the Gashadokuro has fixed on you, distance is your only option.

It dissolves at dawn. The bones scatter. But the grudge remains in them, waiting for the right conditions — the next forgotten war, the next abandoned army, the next accumulation of wrongful deaths — to reassemble what was lost.
```

- [ ] **Step 7: Create Southeast Asia stories**

`content/stories/aswang.md`:
```markdown
---
title: "The Aswang"
creature: "Aswang"
region: "Southeast Asia"
regionSlug: "southeast-asia"
category: "Shapeshifter"
dangerRating: 5
teaser: "By day a mild-mannered neighbor. By night something that steals through the dark on reversed feet, drawn by the smell of the sick and the unborn."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Philippine_mythological_creature.jpg/640px-Philippine_mythological_creature.jpg"
---

The Philippines have no single monster — they have dozens — but the aswang looms largest in the nightmare geography of the archipelago. It is not a single type of creature but a category: a human being, usually female, usually mild-mannered and unremarkable by daylight, who transforms at night into something that feeds on flesh and blood.

The aswang's preferred targets are the sick, the pregnant, and the recently dead. It uses a long, hollow tongue to drain the blood of sleeping victims without waking them. It is specifically drawn to pregnant women, targeting the unborn child — the most vulnerable thing in any household. In some regional traditions, the aswang substitutes a banana trunk or a hollow effigy for the body it takes, so the family wakes to a corpse that is not the person they lost.

Recognizing an aswang in daylight is the central challenge. The folk tradition is specific and unsettling: look at your reflection in their eyes. In a normal person's eyes, your reflection is right-side up. In an aswang's eyes, it is inverted. They also tend to avoid direct eye contact for this reason. Their pets behave strangely around them. They do not eat food that has been blessed.

A variety of herbs and objects are used for protection: garlic woven into strings across doorways and windows, vinegar, salt, and most reliably — a specific plant called bawang (related to garlic) whose smell the aswang cannot tolerate. In rural areas, the Visayan tradition of keeping a jar of oil near the pregnant mother was once standard practice: if the oil began to bubble during the night, the aswang was nearby.

The most disturbing element of the aswang is the neighborly relationship. It is always someone you know.
```

`content/stories/penanggalan.md`:
```markdown
---
title: "The Penanggalan"
creature: "Penanggalan"
region: "Southeast Asia"
regionSlug: "southeast-asia"
category: "Cursed Human"
dangerRating: 4
teaser: "A woman whose head detaches at night, trailing her stomach and intestines behind her as she flies through the dark in search of newborn blood."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Penanggalan_Malaysian_artwork.jpg/640px-Penanggalan_Malaysian_artwork.jpg"
---

Malaysian folklore contains a rich taxonomy of supernatural threats, and the Penanggalan is among the most viscerally disturbing. In life she was a woman — usually one who made a bargain with the supernatural, or who died in childbirth in a state of extreme guilt, or who practiced forbidden midwifery. In death, and sometimes while technically still living, she separates.

The head detaches from the body at the neck. The intestines and stomach come with it — hanging down below the floating head like wet, phosphorescent ropes. The organs glow faintly. She moves through the dark emitting a soft sound that some accounts describe as a tinkling — like small bells, or like the sound of wet leaves in a breeze. She is drawn to the smell of blood, particularly the blood of women in labor and newborn children.

By dawn she must return to her body, which she keeps hidden. She soaks her intestines in a vat of vinegar to shrink them enough to fit back through the neck before she reattaches. Vinegar is therefore both a sign of her presence and a component of protection. If you smell strong vinegar in a house for no apparent reason, you have been warned.

The traditional defenses are specifically anti-aerial: pandan leaves woven into spiky barriers around a birth chamber's windows, since the Penanggalan's dangling intestines will snag on thorns and needles. The midwives who attended births in rural Malaysia kept these preparations as standard practice for centuries — not as superstition but as professional protocol.

She is particularly dangerous because she was once a person. She is not incapable of remorse. She simply cannot stop.
```

- [ ] **Step 8: Create South Asia stories**

`content/stories/rakshasa.md`:
```markdown
---
title: "The Rakshasa"
creature: "Rakshasa"
region: "South Asia"
regionSlug: "south-asia"
category: "Demon"
dangerRating: 5
teaser: "Ancient demons from Hindu mythology with the power to take any form, who feast on human flesh and delight in disrupting sacred rituals."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Ravana.jpg/640px-Ravana.jpg"
---

In the oldest Sanskrit texts, the Rakshasas were already ancient — beings created at the beginning of the world to guard the primordial waters, who were immediately consumed by their own hunger and turned their appetites toward the first men and women. They have been present in human mythology ever since, lurking at the edges of the sacred, waiting for a moment of inattention.

The Rakshasa is a shape-shifter of extraordinary capability. It can appear as any animal, as any human, as a person you love and trust. It can take the form of a sage or a priest — particularly effective at disrupting the religious ceremonies it despises. When priests perform Vedic rituals, Rakshasas may arrive in disguise to corrupt the sacred fire by throwing impure things into it, or to transform and attack the officiant at the critical moment of invocation. This is not random malice — it is ideological opposition to the sacred order.

In their true form, they are enormous and terrible: claws of copper, hair like flame, multiple heads or faces that shift as you watch them, mouths full of iron teeth, eyes that glow like burning coal. The great Rakshasa king Ravana had ten heads and twenty arms and ruled the island fortress of Lanka — his abduction of Sita set the Ramayana in motion, bringing the avatar Rama to confront what the demon world had become.

They are most active at night and least powerful during the day, particularly around noon when the sun is at its strongest. Fire is protective — keeping fires lit around a sacred ceremony creates a barrier they are reluctant to cross. Recitation of specific mantras is effective, particularly the Gayatri.

The deepest knowledge about Rakshasas is this: they are not stupid. They are ancient, learned, and strategic. They know human weakness with the intimacy of long observation. What they lack is patience — they want what they want now, and that impatience has been their ruin in every story they appear in.
```

`content/stories/churel.md`:
```markdown
---
title: "The Churel"
creature: "Churel"
region: "South Asia"
regionSlug: "south-asia"
category: "Ghost/Spirit"
dangerRating: 4
teaser: "A woman who died in childbirth or during the festivals of the dead returns as a spirit of vengeance — beautiful to men, horrifying in her true form."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/South_Asian_spirit.jpg/640px-South_Asian_spirit.jpg"
---

Across India, Pakistan, and Bangladesh, the Churel (also spelled Chudail or Chudel) is feared for two reasons: what created her and what she becomes. She is a woman who died in a state of particular tragedy — in childbirth, or during the transitional periods of the Hindu calendar when the dead are closest to the living, or after severe mistreatment by her husband's family. Her death was wrong in a way that does not allow for rest.

In her spirit form she appears as beautiful to men — exceptionally so, a beauty that does not quite fit the ordinary world, that has something too perfect about it, like a painting more than a person. She lures young men away from their homes, into the forest or the dark. When they have gone far enough, she shows her true form: her feet are backward, her hair hangs loose and wild, her skin is black, her tongue is long and lolling. She drains the life from her victims slowly, returning them to their homes as prematurely aged men who die within days.

The Churel particularly targets men from the household that wronged her in life. She has memory and intention. She is not a generic predator — she has a list. Members of a family where a woman died badly will speak of her as though she is still present in some sense, still watching, still waiting for the moment of vulnerability.

The traditional protections involve specific burial rites for women who die in childbirth or during the inauspicious periods: burying the body face down, with iron nails through the feet, so that if she rises she will walk deeper into the earth rather than out of it. She can be appeased through ritual and offering if her legitimate grievances are acknowledged. Some families have made this reckoning publicly — an admission of wrong and a promise of better treatment for the living women of the household. The acknowledgment matters to her.
```

- [ ] **Step 9: Create Oceania stories**

`content/stories/taniwha.md`:
```markdown
---
title: "The Taniwha"
creature: "Taniwha"
region: "Oceania"
regionSlug: "oceania"
category: "Supernatural Being"
dangerRating: 3
teaser: "Guardian spirits of the Māori people who dwell in rivers, lakes, and the sea — protectors when respected, destroyers when their territory is violated."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Maori_carving_taniwha.jpg/640px-Maori_carving_taniwha.jpg"
---

The Taniwha of Māori tradition do not fit cleanly into Western categories of monster. They are at once dangerous and sacred, capable of terrible violence and genuine guardianship, attached to specific places and specific iwi (tribal groups) in ways that carry legal and spiritual weight acknowledged by the New Zealand government in treaty negotiations.

A Taniwha may take the form of a great shark, a whale, a lizard, a log floating in a river, or something more abstract — a presence in the water, a current that moves wrong, a section of river where the light changes differently. They dwell in places of deep water: harbors, whirlpools, cave systems that run under rivers, the dark sections of the ocean beyond the reef. Each significant body of water in New Zealand traditionally has a Taniwha associated with it.

The relationship between a Taniwha and the people of its territory is reciprocal. It protects them — guiding canoes safely through dangerous waters, warning of storms and attacks, keeping the harbor's fish plentiful. In exchange, the people respect its home, make appropriate offerings, and never build in or near its dwelling without permission and ceremony. Stories abound of Taniwha that capsized canoes of enemies invading their tribe's territory while guiding their own people's vessels safely through the same water.

In the modern era, Taniwha considerations have legitimately delayed or rerouted engineering projects in New Zealand — highway bypasses, canal works, coastal development. This is not unusual. It is the continuation of a negotiated relationship that has existed between the Māori people and the waters of their land for centuries.

Violation of a Taniwha's territory brings drowning. This is not punishment so much as consequence — you have crossed into someone's home without permission, and the inhabitant does not negotiate with trespassers.
```

- [ ] **Step 10: Create Arctic/Siberia stories**

`content/stories/amarok.md`:
```markdown
---
title: "The Amarok"
creature: "Amarok"
region: "Arctic & Siberia"
regionSlug: "arctic-siberia"
category: "Ancient Creature"
dangerRating: 5
teaser: "The great wolf of Inuit legend — not an ordinary wolf but a single vast creature, large as a glacier, that hunts alone and devours those foolish enough to hunt by night."
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Arctic_wolf.jpg/640px-Arctic_wolf.jpg"
---

The Inuit people of the Arctic know wolves the way people elsewhere know weather — as a constant, consequential presence that must be understood if you are to survive. And so when they describe the Amarok, the great wolf, they do so with the precision of people who have lived with the actual animal for thousands of years and know exactly how much more terrifying the supernatural version needs to be.

Amarok is not a pack leader or a spirit of wolves. It is a single entity, enormous beyond the scale of any living wolf — large enough to hunt caribou the way an ordinary wolf hunts rabbits. Its territory is the dark: it hunts only when the sun is fully gone, which in the Arctic means periods that last for months. Those who venture out alone in the polar night without necessity are walking into Amarok's hunting ground.

In the older stories, Amarok had a specific purpose: when caribou overpopulated and grew weak and diseased, Amarok culled the herd. It was nature's corrective, enormous and merciless but ultimately purposeful. The Inuit tell of a man so hungry he prayed for help hunting caribou. Amarok appeared and taught him the way of the hunt — which places, which angles, which weaknesses. Then it disappeared. The great wolf was a teacher as much as a predator, which made its other face — the one that turned on the lone human — more complicated to understand.

The rule is simple and unambiguous: do not hunt alone at night. This is not a rule about wolves. It is a rule about Amarok. The night is its domain, and a solitary figure moving through the dark is not a person in that context — it is prey.

Those who have heard it describe a howl that the cold amplifies and distorts, that seems to come from everywhere and nowhere, that makes the sled dogs go silent and the stars seem briefly closer. After the howl, you have a short time before the sound of something very large begins moving through the snow toward you.
```

- [ ] **Step 11: Create remaining stories**

Create the following files using the same pattern (frontmatter + 4–5 paragraphs of folklore-accurate prose):

`content/stories/rusalka.md` — Slavic/European water spirit, drowned women who drag the living into rivers. regionSlug: "europe", dangerRating: 4, category: "Ghost/Spirit"

`content/stories/manananggal.md` — Filipino torso-severing vampire, older relative of the Aswang, specifically targets pregnant women. regionSlug: "southeast-asia", dangerRating: 5, category: "Cursed Human"

`content/stories/jiangshi.md` — Chinese hopping vampire, killed by yellow paper talismans, freezes when you hold your breath. regionSlug: "east-asia", dangerRating: 3, category: "Cursed Human"

`content/stories/pontianak.md` — Malay/Indonesian spirit of a woman who died in childbirth, appears as a beautiful woman smelling of frangipani near banana trees. regionSlug: "southeast-asia", dangerRating: 4, category: "Ghost/Spirit"

`content/stories/black-shuck.md` — Enormous ghostly black dog of East Anglian England, appearing before storms and deaths. regionSlug: "europe", dangerRating: 3, category: "Folklore"

Each file must follow this frontmatter template exactly:
```markdown
---
title: "[Full Title]"
creature: "[Creature Name]"
region: "[Region Name]"
regionSlug: "[region-slug]"
category: "[Category]"
dangerRating: [1-5]
teaser: "[1-2 sentence hook]"
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/[path]/640px-[filename]"
---
```

For image URLs: search Wikimedia Commons for public domain illustrations of each creature. Use the format `https://upload.wikimedia.org/wikipedia/commons/thumb/[a]/[ab]/[filename]/640px-[filename]`. If no specific image exists, use a related folkloric artwork from the region.

- [ ] **Step 12: Verify all files exist**

```bash
ls content/stories/ | wc -l
```

Expected: 25 (or more) files listed.

- [ ] **Step 13: Commit**

```bash
git add content/stories/
git commit -m "feat: add 25 horror folklore story files from world mythology"
```

---

## Task 6: DangerRating component

**Files:**
- Create: `components/DangerRating.tsx`

- [ ] **Step 1: Create DangerRating component**

```tsx
interface DangerRatingProps {
  rating: number // 1–5
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export default function DangerRating({ rating, size = 'md' }: DangerRatingProps) {
  return (
    <div
      className={`flex items-center gap-0.5 ${sizes[size]}`}
      aria-label={`Danger rating: ${rating} out of 5`}
      title={`Danger: ${rating}/5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-[#8b2500]' : 'text-[#5c3d1e] opacity-30'}
        >
          ☠
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Run dev server and verify no type errors**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/DangerRating.tsx
git commit -m "feat: add DangerRating skull component"
```

---

## Task 7: StoryCard component

**Files:**
- Create: `components/StoryCard.tsx`

- [ ] **Step 1: Create StoryCard component**

```tsx
import Image from 'next/image'
import Link from 'next/link'
import DangerRating from './DangerRating'
import type { Story } from '@/lib/stories'

type StoryCardProps = {
  story: Omit<Story, 'contentHtml'>
  index?: number
}

const rotations = ['rotate-1', '-rotate-1', 'rotate-[0.5deg]', '-rotate-[0.5deg]', 'rotate-0']

export default function StoryCard({ story, index = 0 }: StoryCardProps) {
  const rotation = rotations[index % rotations.length]

  return (
    <Link
      href={`/story/${story.slug}`}
      className={`group block ${rotation} hover:rotate-0 transition-transform duration-300`}
    >
      <article className="bg-[#f5e6c8] border border-[#d4b97a] shadow-[4px_4px_12px_rgba(26,15,0,0.4)] overflow-hidden">
        {/* Creature image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#3d2510]">
          <Image
            src={story.image}
            alt={story.creature}
            fill
            className="object-cover grayscale sepia opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Torn edge overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#f5e6c8]"
            style={{ clipPath: 'polygon(0% 100%, 3% 0%, 7% 80%, 12% 10%, 16% 90%, 22% 5%, 27% 75%, 32% 15%, 38% 85%, 43% 0%, 49% 70%, 54% 20%, 60% 80%, 65% 5%, 71% 90%, 76% 10%, 82% 85%, 88% 0%, 93% 75%, 98% 20%, 100% 100%)' }}
          />
        </div>

        {/* Card content */}
        <div className="p-4">
          {/* Category badge */}
          <span className="text-xs uppercase tracking-widest text-[#8b2500] font-[var(--font-cinzel)]">
            {story.category}
          </span>

          {/* Creature name */}
          <h2 className="mt-1 text-xl font-bold text-[#3d2510] font-[var(--font-cinzel)] leading-tight">
            {story.creature}
          </h2>

          {/* Region */}
          <p className="mt-0.5 text-xs text-[#5c3d1e] italic">
            {story.region}
          </p>

          {/* Danger rating */}
          <div className="mt-2">
            <DangerRating rating={story.dangerRating} size="sm" />
          </div>

          {/* Teaser */}
          <p className="mt-3 text-sm text-[#5c3d1e] leading-relaxed line-clamp-3 font-[var(--font-im-fell)]">
            {story.teaser}
          </p>

          {/* Read more */}
          <p className="mt-3 text-xs uppercase tracking-widest text-[#8b2500] group-hover:underline font-[var(--font-cinzel)]">
            Read the legend →
          </p>
        </div>
      </article>
    </Link>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/StoryCard.tsx
git commit -m "feat: add StoryCard torn journal card component"
```

---

## Task 8: WorldMap component

**Files:**
- Create: `components/WorldMap.tsx`

- [ ] **Step 1: Create WorldMap component**

This is a client component that uses react-simple-maps. It must be dynamically imported (no SSR) in the page that uses it.

```tsx
'use client'

import { useState, useCallback } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useRouter } from 'next/navigation'
import { getRegionSlugByCountryCode, getRegionBySlug } from '@/lib/regions'

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const DEFAULT_STYLE = {
  fill: '#8b6914',
  stroke: '#3d2510',
  strokeWidth: 0.5,
  outline: 'none',
  cursor: 'default',
}

const CLICKABLE_STYLE = {
  fill: '#a07820',
  stroke: '#3d2510',
  strokeWidth: 0.5,
  outline: 'none',
  cursor: 'pointer',
}

const HOVER_STYLE = {
  fill: '#c4840f',
  stroke: '#3d2510',
  strokeWidth: 0.8,
  outline: 'none',
  cursor: 'pointer',
}

const ACTIVE_STYLE = {
  fill: '#8b2500',
  stroke: '#3d2510',
  strokeWidth: 0.8,
  outline: 'none',
  cursor: 'pointer',
}

export default function WorldMap() {
  const router = useRouter()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null)

  const handleClick = useCallback(
    (geoId: string) => {
      const slug = getRegionSlugByCountryCode(String(Number(geoId)))
      if (slug) router.push(`/region/${slug}`)
    },
    [router],
  )

  const handleMouseEnter = useCallback(
    (geoId: string, event: React.MouseEvent) => {
      const slug = getRegionSlugByCountryCode(String(Number(geoId)))
      if (!slug) return
      const region = getRegionBySlug(slug)
      setHoveredRegion(slug)
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        name: region?.name ?? slug,
      })
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null)
    setTooltip(null)
  }, [])

  return (
    <div className="relative w-full h-full">
      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(26,15,0,0.7) 100%)',
        }}
      />

      <ComposableMap
        projectionConfig={{ scale: 147, center: [0, 15] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: Array<{ rsmKey: string; id: string }> }) =>
            geographies.map(geo => {
              const normalizedId = String(Number(geo.id))
              const regionSlug = getRegionSlugByCountryCode(normalizedId)
              const isHovered = hoveredRegion === regionSlug && regionSlug !== null

              let style = DEFAULT_STYLE
              if (regionSlug && isHovered) style = HOVER_STYLE
              else if (regionSlug) style = CLICKABLE_STYLE

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(geo.id)}
                  onMouseEnter={e => handleMouseEnter(geo.id, e as unknown as React.MouseEvent)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: style,
                    hover: regionSlug ? HOVER_STYLE : DEFAULT_STYLE,
                    pressed: regionSlug ? ACTIVE_STYLE : DEFAULT_STYLE,
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-20 px-3 py-1.5 text-sm font-[var(--font-cinzel)] text-[#f5e6c8] bg-[#1a0f00] border border-[#8b6914] shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors. If `react-simple-maps` types cause issues, add `declare module 'react-simple-maps'` in a `types.d.ts` file at the project root.

- [ ] **Step 3: Commit**

```bash
git add components/WorldMap.tsx
git commit -m "feat: add interactive WorldMap component with region highlighting"
```

---

## Task 9: Home page — full-screen map

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

The map must be dynamically imported to skip SSR (react-simple-maps uses browser APIs).

```tsx
import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-[#e8d5a3] font-[var(--font-cinzel)] text-lg tracking-widest animate-pulse">
        Unfolding the map...
      </p>
    </div>
  ),
})

export default function Home() {
  return (
    <main
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #3d2510 0%, #1a0f00 100%)' }}
    >
      {/* Parchment texture layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Site title overlay */}
      <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-black text-[#e8d5a3] font-[var(--font-cinzel)] tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          YOUR NIGHTMARE
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#d4b97a] font-[var(--font-im-fell)] italic tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Select a region to uncover what lurks within
        </p>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <WorldMap />
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center pointer-events-none">
        <p className="text-xs text-[#5c3d1e] font-[var(--font-cinzel)] tracking-widest">
          HORROR · FOLKLORE · ANCIENT TALES
        </p>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Start dev server and verify the map renders**

```bash
npm run dev
```

Open http://localhost:3000. Expected: full-screen dark map with parchment aesthetic, site title at top, map regions highlighted in amber on hover.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add full-screen world map home page"
```

---

## Task 10: Region page

**Files:**
- Create: `app/region/[slug]/page.tsx`

- [ ] **Step 1: Create region page with static generation**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getStoriesByRegion, getAllStories } from '@/lib/stories'
import { getRegionBySlug } from '@/lib/regions'
import StoryCard from '@/components/StoryCard'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const stories = getAllStories()
  const slugs = [...new Set(stories.map(s => s.regionSlug))]
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const region = getRegionBySlug(slug)
  return {
    title: region
      ? `${region.name} — Your Nightmare`
      : 'Region — Your Nightmare',
  }
}

export default async function RegionPage({ params }: Props) {
  const { slug } = await params
  const region = getRegionBySlug(slug)

  if (!region) notFound()

  const stories = getStoriesByRegion(slug)

  return (
    <main
      className="min-h-full"
      style={{ background: 'radial-gradient(ellipse at top, #3d2510 0%, #1a0f00 100%)' }}
    >
      {/* Header */}
      <header className="border-b border-[#5c3d1e] px-6 py-8 text-center">
        <Link
          href="/"
          className="inline-block mb-4 text-xs uppercase tracking-widest text-[#8b6914] hover:text-[#c4840f] font-[var(--font-cinzel)] transition-colors"
        >
          ← Return to the Map
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-[#e8d5a3] font-[var(--font-cinzel)] tracking-wide">
          {region.name}
        </h1>
        <p className="mt-2 text-[#8b6914] font-[var(--font-im-fell)] italic">
          {stories.length} {stories.length === 1 ? 'legend' : 'legends'} from this region
        </p>
        <div className="ink-divider mt-4">✦ ✦ ✦</div>
      </header>

      {/* Story grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {stories.length === 0 ? (
          <p className="text-center text-[#5c3d1e] font-[var(--font-im-fell)] italic text-lg">
            The legends of this region have not yet been written. Check back when the darkness grows deeper.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, i) => (
              <StoryCard key={story.slug} story={story} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Test in dev server**

```bash
npm run dev
```

Navigate to http://localhost:3000/region/europe (or any valid region slug). Expected: region name in header, story cards in a grid.

- [ ] **Step 4: Commit**

```bash
git add app/region/
git commit -m "feat: add region page with story card grid"
```

---

## Task 11: StoryBody component and story page

**Files:**
- Create: `components/StoryBody.tsx`
- Create: `app/story/[slug]/page.tsx`

- [ ] **Step 1: Create StoryBody component**

```tsx
interface StoryBodyProps {
  html: string
}

export default function StoryBody({ html }: StoryBodyProps) {
  return (
    <div
      className="story-body prose max-w-none text-[#3d2510] font-[var(--font-im-fell)] leading-[1.9] text-lg [&_p]:mb-6 [&_p]:text-justify"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
```

- [ ] **Step 2: Create story page**

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getAllStories, getStoryBySlug } from '@/lib/stories'
import DangerRating from '@/components/DangerRating'
import StoryBody from '@/components/StoryBody'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllStories().map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const story = await getStoryBySlug(slug)
    return {
      title: `${story.title} — Your Nightmare`,
      description: story.teaser,
    }
  } catch {
    return { title: 'Story — Your Nightmare' }
  }
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params

  let story
  try {
    story = await getStoryBySlug(slug)
  } catch {
    notFound()
  }

  return (
    <main
      className="min-h-full"
      style={{ background: 'radial-gradient(ellipse at top, #3d2510 0%, #1a0f00 100%)' }}
    >
      {/* Back navigation */}
      <div className="px-6 pt-6">
        <Link
          href={`/region/${story.regionSlug}`}
          className="inline-block text-xs uppercase tracking-widest text-[#8b6914] hover:text-[#c4840f] font-[var(--font-cinzel)] transition-colors"
        >
          ← Back to {story.region}
        </Link>
      </div>

      {/* Hero image */}
      <div className="relative w-full h-64 md:h-96 mt-6 overflow-hidden">
        <Image
          src={story.image}
          alt={story.creature}
          fill
          className="object-cover grayscale sepia opacity-60"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 40%, #1a0f00 100%)',
          }}
        />
        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#8b6914] font-[var(--font-cinzel)]">
            {story.category} · {story.region}
          </p>
          <h1 className="mt-2 text-4xl md:text-6xl font-black text-[#f5e6c8] font-[var(--font-cinzel)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {story.title}
          </h1>
          <div className="mt-3 flex justify-center">
            <DangerRating rating={story.dangerRating} size="lg" />
          </div>
        </div>
      </div>

      {/* Manuscript content */}
      <article className="max-w-2xl mx-auto px-6 py-12">
        {/* Teaser/intro */}
        <p className="text-center text-lg italic text-[#8b6914] font-[var(--font-im-fell)] leading-relaxed mb-8 border-y border-[#5c3d1e] py-6">
          {story.teaser}
        </p>

        <div className="ink-divider">❧</div>

        {/* Story body */}
        <div className="mt-8 p-8 md:p-12" style={{ background: 'rgba(245,230,200,0.05)' }}>
          <StoryBody html={story.contentHtml} />
        </div>

        <div className="ink-divider mt-12">✦ ✦ ✦</div>

        {/* Footer navigation */}
        <div className="mt-8 text-center">
          <Link
            href={`/region/${story.regionSlug}`}
            className="inline-block px-6 py-3 border border-[#8b6914] text-[#e8d5a3] text-sm uppercase tracking-widest font-[var(--font-cinzel)] hover:bg-[#3d2510] transition-colors"
          >
            More from {story.region}
          </Link>
        </div>
      </article>
    </main>
  )
}
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Test in dev server**

Navigate to any story page, e.g., http://localhost:3000/story/wendigo. Expected: hero image, title, danger rating, teaser with decorative divider, full story text with drop cap.

- [ ] **Step 5: Commit**

```bash
git add components/StoryBody.tsx app/story/
git commit -m "feat: add story page with manuscript layout and StoryBody renderer"
```

---

## Task 12: Production build verification

**Files:** none (verification only)

- [ ] **Step 1: Run full type check**

```bash
npx tsc --noEmit
```

Expected: zero errors.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: all tests pass (regions and stories test suites).

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: build completes successfully. All routes pre-rendered as static HTML. Note any warnings about image domains and fix if needed.

- [ ] **Step 4: Fix any build errors**

Common issues:
- **Image domain not configured**: ensure `next.config.ts` has `upload.wikimedia.org` in `remotePatterns`
- **Missing `content/stories` directory**: `mkdir -p content/stories` and add at least one `.md` file
- **react-simple-maps type errors**: add `// @ts-expect-error` above the `Geographies` render callback if types are incomplete, or create `types.d.ts` with `declare module 'react-simple-maps'`

- [ ] **Step 5: Run production server and do a full smoke test**

```bash
npm run start
```

Check:
- `/` — map renders, regions glow on hover, clicking a region navigates
- `/region/europe` — story cards appear in grid
- `/story/wendigo` — full story page renders with image, drop cap, danger rating

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Your Nightmare horror folklore website"
```

---

## Self-Review Checklist

- [x] **Map page** — full-screen WorldMap with SSR disabled via dynamic import
- [x] **Region page** — static params from all regionSlugs in story files, notFound() guard
- [x] **Story page** — static params from all story slugs, markdown → HTML via remark
- [x] **Data layer** — lib/stories.ts and lib/regions.ts fully tested with Jest + ts-jest
- [x] **Content** — 25 story .md files covering all 10 regions
- [x] **Fonts** — Cinzel (titles) + IM Fell English (body) via next/font
- [x] **Aesthetic** — parchment palette, vignette, torn edge, drop cap, skull rating
- [x] **Images** — Wikimedia Commons URLs, configured in next.config.ts
- [x] **No user auth, no CMS, no database** — purely static, add stories via .md files
- [x] **Type consistency** — `Omit<Story, 'contentHtml'>` used consistently in list contexts
