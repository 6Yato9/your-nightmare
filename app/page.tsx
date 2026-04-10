'use client'

import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-[#e8d5a3] font-[var(--font-cinzel)] text-lg tracking-widest animate-pulse">
        Unfolding the map...
      </p>
    </div>
  ),
})

export default function Home() {
  return (
    <main
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #3d2510 0%, #1a0f00 100%)' }}
    >
      {/* Parchment texture layer */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Site title overlay */}
      <div className="absolute top-8 left-0 right-0 z-20 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-black text-[#e8d5a3] font-[var(--font-cinzel)] tracking-[0.2em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          YOUR NIGHTMARE
        </h1>
        <p className="mt-2 text-sm md:text-base text-[#d4b97a] font-[var(--font-im-fell)] italic tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
          Select a region to uncover what lurks within
        </p>
      </div>

      {/* Map */}
      <div className="absolute inset-0 z-0">
        <WorldMap />
      </div>

      {/* Bottom attribution */}
      <div className="absolute bottom-4 left-0 right-0 z-20 text-center pointer-events-none">
        <p className="text-xs text-[#8b6914] font-[var(--font-cinzel)] tracking-widest">
          HORROR · FOLKLORE · ANCIENT TALES
        </p>
      </div>
    </main>
  )
}
