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

  const story = await getStoryBySlug(slug).catch(() => null)
  if (!story) notFound()

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
