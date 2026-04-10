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
          className={i < rating ? 'text-[#c44020]' : 'text-[#8b5e2a] opacity-40'}
        >
          ☠
        </span>
      ))}
    </div>
  )
}
