'use client'

import { useState, useCallback } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useRouter } from 'next/navigation'
import { getRegionSlugByCountryCode, getRegionBySlug } from '@/lib/regions'

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const DEFAULT_STYLE = {
  fill: '#b89a3a',
  stroke: '#9a7840',
  strokeWidth: 0.5,
  outline: 'none',
  cursor: 'default',
}

const CLICKABLE_STYLE = {
  fill: '#c4a840',
  stroke: '#9a7840',
  strokeWidth: 0.5,
  outline: 'none',
  cursor: 'pointer',
}

const HOVER_STYLE = {
  fill: '#e0b830',
  stroke: '#9a7840',
  strokeWidth: 0.8,
  outline: 'none',
  cursor: 'pointer',
}

const ACTIVE_STYLE = {
  fill: '#c43000',
  stroke: '#9a7840',
  strokeWidth: 0.8,
  outline: 'none',
  cursor: 'pointer',
}

export default function WorldMap() {
  const router = useRouter()
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null)

  const handleClick = useCallback(
    (geoId: string) => {
      const slug = getRegionSlugByCountryCode(String(Number(geoId)))
      if (slug) router.push(`/region/${slug}`)
    },
    [router],
  )

  const handleMouseEnter = useCallback(
    (geoId: string, event: React.MouseEvent) => {
      const slug = getRegionSlugByCountryCode(String(Number(geoId)))
      if (!slug) return
      const region = getRegionBySlug(slug)
      setHoveredRegion(slug)
      setTooltip({
        x: event.clientX,
        y: event.clientY,
        name: region?.name ?? slug,
      })
    },
    [],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredRegion(null)
    setTooltip(null)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Vignette overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(26,15,0,0.7) 100%)',
        }}
      />

      <ComposableMap
        projection="geoEquirectangular"
        width={960}
        height={420}
        projectionConfig={{ scale: 130, center: [0, 30] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: Array<{ rsmKey: string; id: string }> }) =>
            geographies.map(geo => {
              const normalizedId = String(Number(geo.id))
              const regionSlug = getRegionSlugByCountryCode(normalizedId)
              const isHovered = hoveredRegion === regionSlug && regionSlug !== null

              let style = DEFAULT_STYLE
              if (regionSlug && isHovered) style = HOVER_STYLE
              else if (regionSlug) style = CLICKABLE_STYLE

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleClick(geo.id)}
                  onMouseEnter={e => handleMouseEnter(geo.id, e as unknown as React.MouseEvent)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    default: style,
                    hover: regionSlug ? HOVER_STYLE : DEFAULT_STYLE,
                    pressed: regionSlug ? ACTIVE_STYLE : DEFAULT_STYLE,
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-20 px-3 py-1.5 text-sm font-[var(--font-cinzel)] text-[#f5e6c8] bg-[#1a0f00] border border-[#c49428] shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  )
}
