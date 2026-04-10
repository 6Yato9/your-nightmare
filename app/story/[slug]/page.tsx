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
      style={{ background: 'radial-gradient(ellipse at top, #5a3218 0%, #1a0f00 100%)' }}
    >
      {/* Back navigation */}
      <div className="px-6 pt-6">
        <Link
          href={`/region/${story.regionSlug}`}
          className="inline-block text-xs uppercase tracking-widest text-[#c49428] hover:text-[#e0a820] font-[var(--font-cinzel)] transition-colors"
        >
          ← Back to {story.region}
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12">

        {/* Left column: title, image, danger rating */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c49428] font-[var(--font-cinzel)] mb-3">
            {story.category} · {story.region}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-[#f5e6c8] font-[var(--font-cinzel)] leading-tight mb-6">
            {story.title}
          </h1>
          <div className="relative w-full aspect-[3/4] overflow-hidden border border-[#8b5e2a]">
            <Image
              src={story.image}
              alt={story.creature}
              fill
              className="object-cover grayscale sepia opacity-70"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
          <div className="mt-5">
            <DangerRating rating={story.dangerRating} size="lg" />
          </div>
        </div>

        {/* Right column: teaser + story body */}
        <div>
          <p className="text-lg italic text-[#d4b97a] font-[var(--font-im-fell)] leading-relaxed mb-8 border-b border-[#8b5e2a] pb-6">
            {story.teaser}
          </p>

          <div className="ink-divider mb-8">❧</div>

          <StoryBody html={story.contentHtml} />

          <div className="ink-divider mt-12">✦ ✦ ✦</div>

          <div className="mt-8 text-center">
            <Link
              href={`/region/${story.regionSlug}`}
              className="inline-block px-6 py-3 border border-[#c49428] text-[#e8d5a3] text-sm uppercase tracking-widest font-[var(--font-cinzel)] hover:bg-[#5a3218] transition-colors"
            >
              More from {story.region}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
