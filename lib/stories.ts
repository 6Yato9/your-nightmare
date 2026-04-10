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

// Exported for testing — allows test suite to redirect to fixture directory
export const storiesConfig = {
  storiesDir: path.join(process.cwd(), 'content/stories'),
}

function parseStoryFile(fileName: string): Omit<Story, 'contentHtml'> {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(storiesConfig.storiesDir, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)

  if (typeof data.title !== 'string') throw new Error(`${fileName}: missing or invalid "title"`)
  if (typeof data.creature !== 'string') throw new Error(`${fileName}: missing or invalid "creature"`)
  if (typeof data.region !== 'string') throw new Error(`${fileName}: missing or invalid "region"`)
  if (typeof data.regionSlug !== 'string') throw new Error(`${fileName}: missing or invalid "regionSlug"`)
  if (typeof data.category !== 'string') throw new Error(`${fileName}: missing or invalid "category"`)
  if (typeof data.dangerRating !== 'number') throw new Error(`${fileName}: missing or invalid "dangerRating"`)
  if (typeof data.teaser !== 'string') throw new Error(`${fileName}: missing or invalid "teaser"`)
  if (typeof data.image !== 'string') throw new Error(`${fileName}: missing or invalid "image"`)

  return {
    slug,
    title: data.title,
    creature: data.creature,
    region: data.region,
    regionSlug: data.regionSlug,
    category: data.category,
    dangerRating: data.dangerRating,
    teaser: data.teaser,
    image: data.image,
  }
}

export function getAllStories(): Omit<Story, 'contentHtml'>[] {
  const fileNames = fs.readdirSync(storiesConfig.storiesDir)
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
  const meta = parseStoryFile(`${slug}.md`)
  const fullPath = path.join(storiesConfig.storiesDir, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { content } = matter(fileContents)
  const processed = await remark().use(html).process(content)
  return {
    ...meta,
    contentHtml: processed.toString(),
  }
}
