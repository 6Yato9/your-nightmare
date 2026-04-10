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
          <div
            className="absolute bottom-0 left-0 right-0 h-4 bg-[#f5e6c8]"
            style={{
              clipPath:
                'polygon(0% 100%, 3% 0%, 7% 80%, 12% 10%, 16% 90%, 22% 5%, 27% 75%, 32% 15%, 38% 85%, 43% 0%, 49% 70%, 54% 20%, 60% 80%, 65% 5%, 71% 90%, 76% 10%, 82% 85%, 88% 0%, 93% 75%, 98% 20%, 100% 100%)',
            }}
          />
        </div>

        {/* Card content */}
        <div className="p-4">
          {/* Category badge */}
          <span className="text-xs uppercase tracking-widest text-[#c44020] font-[var(--font-cinzel)]">
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
          <p className="mt-3 text-xs uppercase tracking-widest text-[#c44020] group-hover:underline font-[var(--font-cinzel)]">
            Read the legend →
          </p>
        </div>
      </article>
    </Link>
  )
}
