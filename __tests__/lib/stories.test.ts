import path from 'path'
import * as storiesModule from '@/lib/stories'

// Redirect reads to test fixtures before any function calls
storiesModule.storiesConfig.storiesDir = path.join(process.cwd(), '__fixtures__/stories')

describe('getAllStories', () => {
  it('returns an array of stories', () => {
    const stories = storiesModule.getAllStories()
    expect(Array.isArray(stories)).toBe(true)
    expect(stories.length).toBeGreaterThan(0)
  })

  it('each story has all required fields with correct types', () => {
    const stories = storiesModule.getAllStories()
    const story = stories[0]
    expect(story.slug).toBe('test-creature')
    expect(story.title).toBe('The Test Creature')
    expect(story.creature).toBe('Test Creature')
    expect(story.region).toBe('Test Region')
    expect(story.regionSlug).toBe('test-region')
    expect(story.category).toBe('Folklore')
    expect(story.dangerRating).toBe(3)
    expect(typeof story.teaser).toBe('string')
    expect(typeof story.image).toBe('string')
  })
})

describe('getStoriesByRegion', () => {
  it('returns stories matching the region slug', () => {
    const stories = storiesModule.getStoriesByRegion('test-region')
    expect(stories).toHaveLength(1)
    expect(stories[0].slug).toBe('test-creature')
  })

  it('returns empty array for unknown region', () => {
    expect(storiesModule.getStoriesByRegion('atlantis')).toHaveLength(0)
  })
})

describe('getStoryBySlug', () => {
  it('returns story with all fields including parsed HTML content', async () => {
    const story = await storiesModule.getStoryBySlug('test-creature')
    expect(story.slug).toBe('test-creature')
    expect(story.title).toBe('The Test Creature')
    expect(story.dangerRating).toBe(3)
    expect(story.contentHtml).toContain('<p>')
    expect(story.contentHtml).toContain('test creature')
  })

  it('throws when slug does not exist', async () => {
    await expect(storiesModule.getStoryBySlug('nonexistent')).rejects.toThrow()
  })
})
