import { MetadataRoute } from 'next'

const baseUrl = 'https://devtoolstack.dev'

const tools = [
  'password-generator',
  'password-strength-checker',
  'random-token-generator',
  'api-key-generator',
  'bcrypt-hash-generator',
  'jwt-decoder',
  'sha256-hash-generator',
  'md5-hash-generator',
  'uuid-generator',
  'json-minify',
  'json-formatter',
  'json-to-csv-converter',
  'csv-to-json-converter',
  'json-diff-compare',
  'base64-encoder-decoder',
  'url-encoder-decoder',
  'timestamp-converter',
  'regex-tester',
  'random-string-generator',
  'lorem-ipsum-generator',
  'random-number-generator',
  'random-color-generator',
  'slugify-text',
  'text-case-converter',
  'whitespace-cleaner',
  'markdown-preview',
  'html-encoder-decoder',
  'qr-code-generator',
  'word-counter',
  'character-counter'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${baseUrl}/${tool}`,
    lastModified: new Date(),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...toolPages
  ]
}