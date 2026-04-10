import { getRegionBySlug, getRegionSlugByCountryCode, REGIONS } from '@/lib/regions'

describe('REGIONS', () => {
  it('has 10 regions', () => {
    expect(REGIONS).toHaveLength(10)
  })

  it('every region has a non-empty countryCodes array', () => {
    REGIONS.forEach(r => {
      expect(r.countryCodes.length).toBeGreaterThan(0)
    })
  })
})

describe('getRegionBySlug', () => {
  it('returns the region for a valid slug', () => {
    const region = getRegionBySlug('europe')
    expect(region).toBeDefined()
    expect(region!.name).toBe('Europe')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getRegionBySlug('atlantis')).toBeUndefined()
  })
})

describe('getRegionSlugByCountryCode', () => {
  it('returns north-america for USA code 840', () => {
    expect(getRegionSlugByCountryCode('840')).toBe('north-america')
  })

  it('returns europe for Germany code 276', () => {
    expect(getRegionSlugByCountryCode('276')).toBe('europe')
  })

  it('returns east-asia for Japan code 392', () => {
    expect(getRegionSlugByCountryCode('392')).toBe('east-asia')
  })

  it('returns undefined for an ocean or unknown code', () => {
    expect(getRegionSlugByCountryCode('000')).toBeUndefined()
  })
})
