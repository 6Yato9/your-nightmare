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
      style={{ background: 'radial-gradient(ellipse at top, #5a3218 0%, #1a0f00 100%)' }}
    >
      {/* Header */}
      <header className="border-b border-[#8b5e2a] px-6 py-8 text-center">
        <Link
          href="/"
          className="inline-block mb-4 text-xs uppercase tracking-widest text-[#c49428] hover:text-[#e0a820] font-[var(--font-cinzel)] transition-colors"
        >
          ← Return to the Map
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-[#e8d5a3] font-[var(--font-cinzel)] tracking-wide">
          {region.name}
        </h1>
        <p className="mt-2 text-[#c49428] font-[var(--font-im-fell)] italic">
          {stories.length} {stories.length === 1 ? 'legend' : 'legends'} from this region
        </p>
        <div className="ink-divider mt-4">✦ ✦ ✦</div>
      </header>

      {/* Story grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {stories.length === 0 ? (
          <p className="text-center text-[#8b5e2a] font-[var(--font-im-fell)] italic text-lg">
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
