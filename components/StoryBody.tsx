interface StoryBodyProps {
  html: string
}

export default function StoryBody({ html }: StoryBodyProps) {
  return (
    <div
      className="story-body prose max-w-none text-[#3d2510] font-[var(--font-im-fell)] leading-[1.9] text-lg [&_p]:mb-6 [&_p]:text-justify"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
