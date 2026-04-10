import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.m?tsx?$': ['ts-jest', { useESM: true, tsconfig: '<rootDir>/tsconfig.jest.json' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(remark|unified|bail|trough|vfile|micromark|mdast-util|hast-util|unist-util|is-plain-obj|decode-named-character-reference|character-entities|zwitch|longest-streak|ccount|devlop|stringify-entities|html-void-elements|trim-lines|property-information|space-separated-tokens|comma-separated-tokens)/)',
  ],
}

export default config
