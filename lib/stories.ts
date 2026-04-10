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
