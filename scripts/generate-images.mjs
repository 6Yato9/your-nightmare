// Usage: node --env-file=.env.local scripts/generate-images.mjs
// Or:    GEMINI_API_KEY=... node scripts/generate-images.mjs
// Generates parchment ink illustrations for every story and updates frontmatter.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'

const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY. Add it to .env.local and run:')
  console.error('  node --env-file=.env.local scripts/generate-images.mjs')
  process.exit(1)
}

const STORIES_DIR = join(process.cwd(), 'content/stories')
const IMAGES_DIR = join(process.cwd(), 'public/images/stories')
mkdirSync(IMAGES_DIR, { recursive: true })

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (key) fm[key] = val
  }
  return fm
}

function buildPrompt(creature, category, region, teaser) {
  const desc = teaser.length > 100 ? teaser.slice(0, 100) + '...' : teaser
  return (
    `Detailed pen and ink illustration of ${creature}, a ${category} from ${region} folklore. ` +
    `${desc} ` +
    `Medieval bestiary manuscript style. Fine black ink linework, cross-hatching, stippling. ` +
    `Monochrome, no color. Aged yellowed parchment paper texture background. ` +
    `Like an illustration from an 18th century naturalist's monster compendium or demonology text. ` +
    `High detail, dramatic composition, the creature fills the frame.`
  )
}

async function generateImage(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${API_KEY}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '3:4',
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  const b64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!b64) throw new Error('No image data in response')
  return Buffer.from(b64, 'base64')
}

const files = readdirSync(STORIES_DIR)
  .filter(f => f.endsWith('.md'))
  .sort()

let success = 0
let fail = 0

for (const file of files) {
  const slug = basename(file, '.md')
  const filePath = join(STORIES_DIR, file)
  const outPath = join(IMAGES_DIR, `${slug}.png`)

  // Skip if already generated
  if (existsSync(outPath)) {
    console.log(`skip ${slug} (already exists)`)
    continue
  }

  const content = readFileSync(filePath, 'utf-8')
  const fm = parseFrontmatter(content)

  if (!fm.creature) {
    console.log(`skip ${slug} (no creature field)`)
    continue
  }

  const prompt = buildPrompt(fm.creature, fm.category || 'creature', fm.region || 'unknown', fm.teaser || '')
  process.stdout.write(`generating ${slug}... `)

  try {
    const buf = await generateImage(prompt)
    writeFileSync(outPath, buf)

    // Update image field in frontmatter
    const updated = content.replace(/^image:.*$/m, `image: "/images/stories/${slug}.png"`)
    writeFileSync(filePath, updated)

    console.log('✓')
    success++
  } catch (err) {
    console.log(`✗  ${err.message}`)
    fail++
  }

  // Rate limit
  await new Promise(r => setTimeout(r, 2000))
}

console.log(`\nDone: ${success} generated, ${fail} failed.`)
