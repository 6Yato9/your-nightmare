import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(remark|remark-html|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-util-stringify-position|mdast-util-from-markdown|mdast-util-to-markdown|mdast-util-to-hast|mdast-util-definitions|mdast-util-phrasing-content|hast-util-to-html|hast-util-whitespace|hast-util-is-element|hast-util-raw|property-information|space-separated-tokens|comma-separated-tokens|micromark|micromark-core-commonmark|micromark-extension-gfm|micromark-util-combine-extensions|micromark-util-chunked|micromark-util-character|micromark-util-encode|micromark-util-html-tag-name|micromark-util-normalize-identifier|micromark-util-resolve-all|micromark-util-sanitize-uri|micromark-util-subtokenize|micromark-util-decode-numeric-character-reference|micromark-util-decode-string|decode-named-character-reference|character-entities|zwitch|longest-streak|ccount)/)',
  ],
}

export default config
