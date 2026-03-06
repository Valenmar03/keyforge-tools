import { MetadataRoute } from 'next'

const baseUrl = 'https://devtoolstack.dev'

const tools = [
  'password-generator',
  'password-strength-checker',
  'random-token-generator',
  'api-key-generator',
  'bcrypt-hash-generator',
  'jwt-decoder',
  'uuid-generator',
  'json-formatter',
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
  'markdown-preview'
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