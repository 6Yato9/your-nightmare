import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const FIXTURE_DIR = path.join(process.cwd(), '__fixtures__/stories')

describe('stories parsing', () => {
  it('parses frontmatter from a markdown file', () => {
    const content = fs.readFileSync(path.join(FIXTURE_DIR, 'test-creature.md'), 'utf8')
    const { data } = matter(content)
    expect(data.title).toBe('The Test Creature')
    expect(data.dangerRating).toBe(3)
    expect(data.regionSlug).toBe('test-region')
  })

  it('renders markdown body to HTML', async () => {
    const content = fs.readFileSync(path.join(FIXTURE_DIR, 'test-creature.md'), 'utf8')
    const { content: body } = matter(content)
    const processed = await remark().use(html).process(body)
    const contentHtml = processed.toString()
    expect(contentHtml).toContain('<p>')
    expect(contentHtml).toContain('test creature')
  })
})
