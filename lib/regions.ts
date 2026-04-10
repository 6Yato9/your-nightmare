export interface Region {
  name: string
  slug: string
  countryCodes: string[] // Numeric ISO 3166-1 codes as strings
}

export const REGIONS: Region[] = [
  {
    name: 'North America',
    slug: 'north-america',
    countryCodes: [
      '840', '124', '484', '320', '84', '340', '222', '558', '188', '591',
      '192', '388', '332', '214', '44', '780', '659', '662', '670', '28',
      '52', '212', '308', '630',
    ],
  },
  {
    name: 'South America',
    slug: 'south-america',
    countryCodes: [
      '76', '32', '170', '604', '862', '152', '218', '68', '600', '858',
      '328', '740', '254',
    ],
  },
  {
    name: 'Europe',
    slug: 'europe',
    countryCodes: [
      '276', '250', '826', '724', '380', '616', '528', '56', '756', '40',
      '620', '752', '578', '208', '246', '300', '642', '348', '203', '703',
      '100', '191', '688', '70', '807', '8', '499', '705', '428', '440',
      '233', '112', '804', '498', '352', '372', '442', '438', '674', '336',
      '470', '196', '20', '492', '643',
    ],
  },
  {
    name: 'Africa',
    slug: 'africa',
    countryCodes: [
      '566', '231', '818', '180', '710', '834', '404', '12', '729', '800',
      '508', '288', '450', '120', '384', '562', '466', '24', '854', '894',
      '454', '716', '686', '148', '706', '324', '646', '204', '788', '108',
      '728', '768', '694', '434', '140', '430', '478', '232', '516', '270',
      '72', '266', '426', '624', '226', '480', '748', '262', '174', '132',
      '678',
    ],
  },
  {
    name: 'Middle East',
    slug: 'middle-east',
    countryCodes: [
      '682', '364', '368', '792', '887', '760', '400', '784', '376', '422',
      '512', '414', '634', '48', '275', '4', '586', '398', '860', '795',
      '417', '762', '31', '51', '268',
    ],
  },
  {
    name: 'East Asia',
    slug: 'east-asia',
    countryCodes: ['156', '392', '408', '410', '496', '158'],
  },
  {
    name: 'Southeast Asia',
    slug: 'southeast-asia',
    countryCodes: ['360', '764', '704', '458', '608', '104', '116', '418', '702', '96', '626'],
  },
  {
    name: 'South Asia',
    slug: 'south-asia',
    countryCodes: ['356', '50', '524', '144', '462', '64'],
  },
  {
    name: 'Oceania',
    slug: 'oceania',
    countryCodes: [
      '36', '554', '598', '242', '90', '548', '882', '776', '583', '585',
      '584', '296', '520', '798',
    ],
  },
  {
    name: 'Arctic & Siberia',
    slug: 'arctic-siberia',
    countryCodes: ['304'],
  },
]

// Build a lookup map for O(1) access
const countryToRegion = new Map<string, string>()
for (const region of REGIONS) {
  for (const code of region.countryCodes) {
    countryToRegion.set(code, region.slug)
  }
}

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find(r => r.slug === slug)
}

export function getRegionSlugByCountryCode(code: string): string | undefined {
  return countryToRegion.get(code)
}
