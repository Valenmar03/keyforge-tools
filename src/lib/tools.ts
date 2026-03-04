import type { LucideIcon } from "lucide-react";

export type CategoryId = "security" | "dev-utilities" | "generators";

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  relatedSlugs: string[];
  seoContent: string;
  faqItems: FAQItem[];
  // opcional por si querés íconos en cards/listado:
  icon?: LucideIcon;
};

export const categories: Category[] = [
  {
    id: "security",
    name: "Security",
    description:
      "Password generators, hash tools, and security utilities for protecting your data.",
  },
  {
    id: "dev-utilities",
    name: "Dev Utilities",
    description:
      "JSON formatters, encoders, converters, and essential developer tools.",
  },
  {
    id: "generators",
    name: "Generators",
    description:
      "Random strings, colors, Lorem Ipsum, and text manipulation tools.",
  },
];

export const tools: Tool[] = [
  // ==================== SECURITY ====================
  {
    slug: 'password-generator',
    title: 'Password Generator',
    description: 'Generate cryptographically secure random passwords with customizable length and character sets.',
    category: 'security',
    keywords: ['password', 'secure', 'random', 'generator', 'strong password'],
    relatedSlugs: ['password-strength-checker', 'random-token-generator', 'api-key-generator'],
    seoContent: `
## What is a Password Generator?

A password generator is a tool that creates random, unpredictable passwords using cryptographically secure algorithms. Unlike human-created passwords that often follow predictable patterns, generated passwords use true randomness to maximize security.

## Why Use a Password Generator?

**Security**: Human-created passwords are notoriously weak. Studies show that most people use variations of common words, dates, or simple patterns. A password generator eliminates these vulnerabilities by creating truly random strings.

**Uniqueness**: Every account should have a unique password. Reusing passwords means that if one account is compromised, all accounts using that password are at risk. A generator makes creating unique passwords effortless.

**Compliance**: Many security standards (PCI-DSS, HIPAA, SOC 2) require passwords of specific lengths and complexity. This tool helps you meet those requirements instantly.

## How This Tool Works

Our password generator uses \`crypto.getRandomValues()\`, the browser's cryptographically secure random number generator. This is the same API used by security professionals and is recommended by OWASP for generating sensitive values.

**No Modulo Bias**: We use rejection sampling to ensure each character has exactly equal probability, avoiding the subtle bias that simpler implementations introduce.

## Best Practices

- Use at least 16 characters for important accounts
- Include uppercase, lowercase, numbers, and symbols
- Never reuse passwords across sites
- Consider using a password manager to store generated passwords
- For master passwords, use 20+ characters

## Privacy Guarantee

This tool runs entirely in your browser. Your generated passwords are never transmitted anywhere. There are no analytics, no server logs, and no way for anyone—including us—to see what you generate.
    `,
    faqItems: [
      { question: 'Is this password generator secure?', answer: 'Yes. We use crypto.getRandomValues(), the browser\'s cryptographically secure random number generator, which provides true randomness suitable for security applications.' },
      { question: 'Are my passwords stored or transmitted?', answer: 'No. Everything runs locally in your browser. No data is ever sent to any server. You can verify this by checking your browser\'s network tab.' },
      { question: 'What makes a strong password?', answer: 'A strong password is at least 16 characters long, uses a mix of uppercase, lowercase, numbers, and symbols, is completely random (not based on words), and is unique to each account.' },
      { question: 'Can I use this offline?', answer: 'Yes. Once the page loads, you can disconnect from the internet and the generator will continue to work because all logic runs in your browser.' }
    ]
  },
  {
    slug: 'password-strength-checker',
    title: 'Password Strength Checker',
    description: 'Analyze password strength with entropy calculation, pattern detection, and improvement suggestions.',
    category: 'security',
    keywords: ['password', 'strength', 'checker', 'entropy', 'security audit'],
    relatedSlugs: ['password-generator', 'bcrypt-hash-generator', 'random-token-generator'],
    seoContent: `
## What is Password Strength?

Password strength measures how resistant a password is to guessing attacks. It's determined by length, character diversity, randomness, and absence of common patterns. Our checker analyzes all these factors to give you an accurate assessment.

## How We Measure Strength

**Entropy Calculation**: We calculate bits of entropy based on the character pool and length. Higher entropy means more possible combinations an attacker must try.

**Pattern Detection**: We check for common patterns like sequential characters (abc, 123), keyboard patterns (qwerty), repeated characters, and common words.

## Understanding the Score

- **0-20%**: Extremely weak - can be cracked in seconds
- **20-40%**: Weak - vulnerable to dictionary attacks
- **40-60%**: Moderate - offers basic protection
- **60-80%**: Strong - resistant to most attacks
- **80-100%**: Very strong - suitable for high-security accounts

## Privacy First

Your password is analyzed entirely in your browser using JavaScript. It never leaves your device—we can't see it, store it, or transmit it anywhere.
    `,
    faqItems: [
      { question: 'Is it safe to enter my real password here?', answer: 'Yes. The analysis happens entirely in your browser. Your password is never sent to any server.' },
      { question: 'What is password entropy?', answer: 'Entropy measures the randomness of a password in bits. Each bit doubles the number of possible combinations.' },
      { question: 'My password scored low but looks complex. Why?', answer: 'Common patterns like "Password123!" score poorly because attackers know to try these variations first.' }
    ]
  },
  {
    slug: 'random-token-generator',
    title: 'Random Token Generator',
    description: 'Create secure random tokens in hex, base64, or alphanumeric format for sessions, CSRF, and more.',
    category: 'security',
    keywords: ['token', 'random', 'hex', 'base64', 'session', 'CSRF'],
    relatedSlugs: ['api-key-generator', 'password-generator', 'uuid-generator'],
    seoContent: `
## What is a Random Token?

A random token is a string of characters generated using cryptographically secure randomness. Tokens are used throughout web development for session identifiers, CSRF protection, email verification links, password reset URLs, and API authentication.

## Token Formats Explained

**Hex**: Characters 0-9 and a-f. Common for session IDs and database tokens.
**Base64**: Uses A-Z, a-z, 0-9, +, and /. More compact encoding.
**URL-Safe Base64**: Like Base64 but replaces + and / with - and _.
**Alphanumeric**: A-Z, a-z, 0-9 only. Clean and works everywhere.

## Recommended Token Lengths

- **Session IDs**: 128 bits (32 hex chars)
- **CSRF Tokens**: 128 bits minimum
- **API Keys**: 256 bits for long-lived tokens

## Security Considerations

We use \`crypto.getRandomValues()\` which provides cryptographically secure random bytes. Never log tokens or expose them in error messages.
    `,
    faqItems: [
      { question: 'How many bits of entropy do I need?', answer: 'For security tokens, 128 bits is the minimum recommended. For long-lived tokens like API keys, use 256 bits.' },
      { question: 'What\'s the difference between hex and base64?', answer: 'Hex uses 16 characters encoding 4 bits per character. Base64 uses 64 characters encoding 6 bits per character, making it more compact.' },
      { question: 'Is this suitable for production use?', answer: 'Yes. The tokens are generated using crypto.getRandomValues(), the same API recommended by security standards.' }
    ]
  },
  {
    slug: 'api-key-generator',
    title: 'API Key Generator',
    description: 'Generate secure API keys with custom prefixes, formats, and lengths for your applications.',
    category: 'security',
    keywords: ['API key', 'secret key', 'authentication', 'token'],
    relatedSlugs: ['random-token-generator', 'uuid-generator', 'password-generator'],
    seoContent: `
## What is an API Key?

An API key is a secret token used to authenticate requests to an API. Unlike user credentials, API keys typically identify an application or service account rather than an individual user.

## API Key Best Practices

**Use Prefixes**: Keys like \`sk_live_abc123\` are immediately identifiable. Prefixes help with distinguishing live vs test keys and automated secret scanning.

**Appropriate Length**: For API keys, 32 bytes (256 bits) is standard.

**Separate Keys by Environment**: Never use production keys in development.

## Security Guidelines

- Store API keys securely (environment variables, secret managers)
- Never commit keys to version control
- Rotate keys periodically
- Monitor key usage for anomalies
    `,
    faqItems: [
      { question: 'What prefix should I use for API keys?', answer: 'Common conventions: sk_ for secret keys, pk_ for public keys, followed by live_ or test_ for environment.' },
      { question: 'How long should API keys be?', answer: 'At least 32 characters (256 bits) for production use.' },
      { question: 'Should I hash stored API keys?', answer: 'Yes. Store only the hash (using SHA-256) in your database.' }
    ]
  },
  {
    slug: 'bcrypt-hash-generator',
    title: 'Bcrypt Hash Generator',
    description: 'Generate bcrypt password hashes with adjustable cost factor for secure password storage.',
    category: 'security',
    keywords: ['bcrypt', 'hash', 'password hash', 'encryption', 'security'],
    relatedSlugs: ['password-generator', 'password-strength-checker', 'random-token-generator'],
    seoContent: `
## What is Bcrypt?

Bcrypt is a password hashing function designed specifically for securing passwords. Unlike fast hashes like SHA-256, bcrypt is intentionally slow, making brute-force attacks impractical.

## Why Use Bcrypt?

**Adaptive Cost**: The "cost factor" determines how many iterations bcrypt performs. As computers get faster, you can increase this factor.

**Built-in Salt**: Each hash includes a random salt, meaning identical passwords produce different hashes.

**Industry Standard**: Bcrypt is recommended by OWASP and used by major frameworks.

## Understanding Cost Factors

- **Cost 10**: ~100ms, minimum for production
- **Cost 12**: ~300ms, good balance
- **Cost 14**: ~1 second, high security

## Security Notes

Never hash passwords on the client side in production—always hash on your server. This tool is for learning and generating example hashes.
    `,
    faqItems: [
      { question: 'What cost factor should I use?', answer: 'Use the highest cost that keeps hashing under 500ms on your server. Cost 12 is a good starting point.' },
      { question: 'Is bcrypt better than SHA-256?', answer: 'For passwords, yes. SHA-256 is too fast—attackers can try billions of guesses per second.' },
      { question: 'Can I decrypt a bcrypt hash?', answer: 'No. Bcrypt is a one-way function. You can only verify passwords by hashing and comparing.' }
    ]
  },
  {
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) to view header, payload, and signature information.',
    category: 'security',
    keywords: ['JWT', 'JSON Web Token', 'decode', 'authentication', 'token'],
    relatedSlugs: ['base64-encoder-decoder', 'json-formatter', 'api-key-generator'],
    seoContent: `
## What is a JWT?

A JSON Web Token (JWT) is a compact, URL-safe token format used for authentication. JWTs consist of three Base64URL-encoded parts: Header, Payload, and Signature.

## JWT Structure

**Header**: Contains the token type (JWT) and signing algorithm.
**Payload**: Contains claims—statements about the user and metadata.
**Signature**: Cryptographic signature verifying the token hasn't been tampered with.

## When to Use This Tool

- Debugging tokens during development
- Checking expiration times and claims
- Learning JWT structure
- Security review

## Important Security Notes

**This tool decodes only—it does not verify signatures.** Never trust claims from a JWT without verifying its signature on your server.
    `,
    faqItems: [
      { question: 'Does this tool verify the JWT signature?', answer: 'No. This tool only decodes and displays the token contents. Signature verification requires the secret key.' },
      { question: 'Can someone read my JWT without the secret?', answer: 'Yes. JWT payloads are only Base64-encoded, not encrypted. The signature only prevents modification.' },
      { question: 'Why is my token showing as expired?', answer: 'Check the exp claim—it\'s a Unix timestamp. Compare it to the current time.' }
    ]
  },

  // ==================== DEV UTILITIES ====================
  {
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate RFC 4122 compliant UUIDs (v4) using cryptographically secure randomness.',
    category: 'dev-utilities',
    keywords: ['UUID', 'GUID', 'unique ID', 'identifier', 'v4'],
    relatedSlugs: ['random-token-generator', 'api-key-generator', 'random-string-generator'],
    seoContent: `
## What is a UUID?

A UUID (Universally Unique Identifier) is a 128-bit identifier designed to be unique across space and time. Version 4 UUIDs use random numbers.

## Use Cases

- Database primary keys
- Distributed systems
- Session identifiers
- File/resource naming
- Correlation IDs

## Security Guarantee

We use crypto.getRandomValues() for cryptographic randomness. Version 4 UUIDs have 122 random bits, making collision probability infinitesimally small.
    `,
    faqItems: [
      { question: 'What\'s the collision probability of UUIDs?', answer: 'Effectively zero. You\'d need 2.71 quintillion UUIDs for a 50% collision chance.' },
      { question: 'Should I use UUIDs as database primary keys?', answer: 'It depends on your needs. UUIDs work well in distributed systems but have performance implications for large tables.' },
      { question: 'Are these UUIDs RFC 4122 compliant?', answer: 'Yes. They follow the Version 4 (random) UUID specification.' }
    ]
  },
  {
    slug: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, and beautify JSON with syntax highlighting and error detection.',
    category: 'dev-utilities',
    keywords: ['JSON', 'formatter', 'beautify', 'validate', 'pretty print'],
    relatedSlugs: ['base64-encoder-decoder', 'url-encoder-decoder', 'jwt-decoder'],
    seoContent: `
## What is JSON Formatting?

JSON formatting transforms compact JSON into readable, indented structure. This tool also validates JSON syntax.

## Features

**Pretty Print**: Adds proper indentation and line breaks.
**Minify**: Removes all unnecessary whitespace.
**Validation**: Identifies syntax errors with descriptions.

## Common JSON Errors

- Missing or extra commas
- Unquoted property names
- Single quotes instead of double quotes
- Trailing commas
- Comments (JSON doesn't support them)
    `,
    faqItems: [
      { question: 'Why does my JSON show as invalid?', answer: 'Common issues: trailing commas, single quotes, unquoted keys, or comments.' },
      { question: 'Can I add comments to JSON?', answer: 'Standard JSON doesn\'t support comments. Consider JSON5 or JSONC formats.' },
      { question: 'How do I minify JSON?', answer: 'Use the Minify option in this tool.' }
    ]
  },
  {
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder/Decoder',
    description: 'Encode text to Base64 or decode Base64 strings back to plain text.',
    category: 'dev-utilities',
    keywords: ['base64', 'encode', 'decode', 'binary', 'text'],
    relatedSlugs: ['url-encoder-decoder', 'jwt-decoder', 'json-formatter'],
    seoContent: `
## What is Base64 Encoding?

Base64 is a binary-to-text encoding that represents binary data using 64 ASCII characters. It's used to transmit binary data through text-only channels.

## Common Use Cases

- Data URIs for embedding images
- API payloads
- Email attachments
- Basic Auth headers
- JWT tokens

## Not Encryption

Base64 is encoding, not encryption. Anyone can decode Base64 data. Never use it to hide sensitive information.
    `,
    faqItems: [
      { question: 'Is Base64 secure?', answer: 'No. Base64 is encoding, not encryption. It\'s trivial to decode.' },
      { question: 'Why does Base64 increase file size?', answer: 'Base64 uses 6 bits per character in 8-bit bytes, resulting in ~33% size increase.' },
      { question: 'When should I use URL-safe Base64?', answer: 'When the encoded string will appear in URLs.' }
    ]
  },
  {
    slug: 'url-encoder-decoder',
    title: 'URL Encoder/Decoder',
    description: 'Encode special characters for URLs or decode percent-encoded URL strings.',
    category: 'dev-utilities',
    keywords: ['URL', 'encode', 'decode', 'percent encoding', 'URI'],
    relatedSlugs: ['base64-encoder-decoder', 'json-formatter', 'slugify-text'],
    seoContent: `
## What is URL Encoding?

URL encoding (percent-encoding) converts characters not allowed in URLs into a safe format. Special characters are replaced with % followed by their hexadecimal ASCII value.

## Common Encodings

- Space → %20 or +
- & → %26
- = → %3D
- / → %2F

## Use Cases

- Query parameters with user input
- Form data
- API requests
- Internationalized URLs
    `,
    faqItems: [
      { question: 'When should I URL encode?', answer: 'Encode user input before adding it to URLs, especially query parameters.' },
      { question: 'Why are spaces sometimes + and sometimes %20?', answer: 'In query strings, spaces can be + or %20. In paths, %20 is correct.' },
      { question: 'How do I encode an entire URL?', answer: 'Use encodeURI() for complete URLs, encodeURIComponent() for individual values.' }
    ]
  },
  {
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description: 'Convert between Unix timestamps, ISO 8601 dates, and human-readable formats.',
    category: 'dev-utilities',
    keywords: ['timestamp', 'Unix', 'epoch', 'date', 'time', 'ISO 8601'],
    relatedSlugs: ['uuid-generator', 'json-formatter', 'regex-tester'],
    seoContent: `
## What is a Unix Timestamp?

A Unix timestamp is the number of seconds since January 1, 1970 00:00:00 UTC (the Unix Epoch).

## Supported Formats

- Unix Timestamp (seconds)
- Unix Timestamp (milliseconds)
- ISO 8601
- RFC 2822
- Human Readable

## Common Use Cases

- API development
- Database queries
- Debugging logs
- Scheduling
    `,
    faqItems: [
      { question: 'Are timestamps in seconds or milliseconds?', answer: 'It varies. Unix uses seconds, JavaScript uses milliseconds. Check the magnitude—10 digits is seconds, 13 is milliseconds.' },
      { question: 'How do I get the current timestamp?', answer: 'In JavaScript: Math.floor(Date.now() / 1000) for seconds.' },
      { question: 'Why do timestamps look different in my database?', answer: 'Databases store timestamps in different formats and precisions.' }
    ]
  },
  {
    slug: 'regex-tester',
    title: 'Regex Tester',
    description: 'Test and debug regular expressions with real-time matching, groups, and explanation.',
    category: 'dev-utilities',
    keywords: ['regex', 'regular expression', 'pattern', 'match', 'test'],
    relatedSlugs: ['json-formatter', 'text-case-converter', 'whitespace-cleaner'],
    seoContent: `
## What is Regex?

Regular expressions (regex) are patterns used to match character combinations in strings. They're essential for validation, search, parsing, and text manipulation.

## Features

- Real-time matching
- Capture groups
- Flags support (g, i, m)
- Match details

## Common Patterns

- Email: \`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`
- Phone: \`\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\`
- Date: \`\\d{4}-\\d{2}-\\d{2}\`
    `,
    faqItems: [
      { question: 'Why isn\'t my regex matching?', answer: 'Common issues: forgetting to escape special characters, missing flags, incorrect anchors.' },
      { question: 'What does the global (g) flag do?', answer: 'Without g, regex stops after the first match. With g, it finds all matches.' },
      { question: 'How do I match across multiple lines?', answer: 'Use the multiline (m) flag.' }
    ]
  },

  // ==================== GENERATORS ====================
  {
    slug: 'random-string-generator',
    title: 'Random String Generator',
    description: 'Generate random strings with custom character sets, lengths, and formats.',
    category: 'generators',
    keywords: ['random', 'string', 'generator', 'characters', 'text'],
    relatedSlugs: ['password-generator', 'uuid-generator', 'random-token-generator'],
    seoContent: `
## Random String Generation

Generate random strings for testing, placeholder data, or any situation requiring arbitrary text.

## Character Set Options

- Lowercase (a-z)
- Uppercase (A-Z)
- Numbers (0-9)
- Symbols
- Custom character sets

## Use Cases

- Testing
- Placeholder content
- Unique identifiers
- Sample data
    `,
    faqItems: [
      { question: 'Are these strings truly random?', answer: 'Yes, we use crypto.getRandomValues() for cryptographic randomness.' },
      { question: 'Can I generate strings with specific patterns?', answer: 'This tool generates purely random strings. For patterns, use regex-based generators.' }
    ]
  },
  {
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text in various formats: paragraphs, sentences, or words.',
    category: 'generators',
    keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'filler'],
    relatedSlugs: ['random-string-generator', 'markdown-preview', 'text-case-converter'],
    seoContent: `
## What is Lorem Ipsum?

Lorem Ipsum is placeholder text used in design since the 1500s. It resembles natural language without being distracting.

## Generation Options

- Paragraphs
- Sentences
- Words
- Lists
    `,
    faqItems: [
      { question: 'What does Lorem Ipsum mean?', answer: 'It\'s scrambled Latin from "De finibus bonorum et malorum" by Cicero (45 BC).' },
      { question: 'Should I use Lorem Ipsum in production?', answer: 'No. It\'s only for development and design phases.' }
    ]
  },
  {
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    description: 'Generate random numbers within a range, with options for integers or decimals.',
    category: 'generators',
    keywords: ['random', 'number', 'integer', 'decimal', 'range'],
    relatedSlugs: ['random-string-generator', 'uuid-generator', 'random-color-generator'],
    seoContent: `
## Secure Random Number Generation

Generate random numbers using cryptographic randomness. Perfect for testing, simulations, games, or any application requiring unpredictable values.

## Options

- Range (min/max)
- Integer or decimal
- Multiple numbers at once
- Unique values
    `,
    faqItems: [
      { question: 'How random are these numbers?', answer: 'We use crypto.getRandomValues() for cryptographically secure randomness.' },
      { question: 'Can I guarantee unique numbers?', answer: 'Enable the "unique" option when generating multiple integers.' }
    ]
  },
  {
    slug: 'random-color-generator',
    title: 'Random Color Generator',
    description: 'Generate random colors in HEX, RGB, HSL formats with preview and palette creation.',
    category: 'generators',
    keywords: ['color', 'random', 'hex', 'RGB', 'HSL', 'palette'],
    relatedSlugs: ['random-string-generator', 'random-number-generator', 'lorem-ipsum-generator'],
    seoContent: `
## Random Color Generation

Generate random colors for design inspiration, testing, or creative projects.

## Color Formats

- HEX (#FF5733)
- RGB (rgb(255, 87, 51))
- HSL (hsl(14, 100%, 60%))
    `,
    faqItems: [
      { question: 'How can I generate colors that look good together?', answer: 'Use the palette feature with harmony options like complementary or analogous.' },
      { question: 'Can I limit the color range?', answer: 'Yes, use hue, saturation, and lightness constraints.' }
    ]
  },
  {
    slug: 'slugify-text',
    title: 'Slugify Text',
    description: 'Convert text to URL-friendly slugs with customizable separators and transliteration.',
    category: 'generators',
    keywords: ['slug', 'URL', 'SEO', 'permalink', 'URL-friendly'],
    relatedSlugs: ['url-encoder-decoder', 'text-case-converter', 'whitespace-cleaner'],
    seoContent: `
## What is a Slug?

A slug is a URL-friendly version of text. "My Blog Post!" becomes "my-blog-post".

## Slugification Rules

- Lowercase all characters
- Replace spaces with hyphens
- Remove special characters
- Transliterate accented characters
    `,
    faqItems: [
      { question: 'Should I use hyphens or underscores?', answer: 'Hyphens are preferred. Google treats hyphens as word separators.' },
      { question: 'How long should slugs be?', answer: 'Keep slugs under 60 characters.' }
    ]
  },
  {
    slug: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between cases: lowercase, UPPERCASE, Title Case, camelCase, snake_case, and more.',
    category: 'generators',
    keywords: ['case', 'uppercase', 'lowercase', 'camelCase', 'snake_case'],
    relatedSlugs: ['slugify-text', 'whitespace-cleaner', 'regex-tester'],
    seoContent: `
## Text Case Conversion

Convert text between various case formats used in programming and writing.

## Supported Cases

- lowercase
- UPPERCASE
- Title Case
- camelCase
- PascalCase
- snake_case
- kebab-case
- CONSTANT_CASE
    `,
    faqItems: [
      { question: 'What\'s the difference between camelCase and PascalCase?', answer: 'camelCase starts lowercase (firstName), PascalCase starts uppercase (FirstName).' },
      { question: 'When should I use snake_case vs kebab-case?', answer: 'snake_case for Python/Ruby/databases, kebab-case for URLs/CSS.' }
    ]
  },
  {
    slug: 'whitespace-cleaner',
    title: 'Whitespace Cleaner',
    description: 'Remove extra whitespace, trim lines, normalize line endings, and clean up messy text.',
    category: 'generators',
    keywords: ['whitespace', 'trim', 'clean', 'spaces', 'newlines'],
    relatedSlugs: ['text-case-converter', 'regex-tester', 'json-formatter'],
    seoContent: `
## Whitespace Cleaning

Clean up messy text by removing extra spaces and normalizing line endings.

## Cleaning Options

- Trim leading/trailing whitespace
- Collapse multiple spaces
- Remove empty lines
- Normalize line endings
    `,
    faqItems: [
      { question: 'Why are line endings different on different systems?', answer: 'Windows uses CRLF, Unix/Linux/Mac use LF.' },
      { question: 'What are invisible characters?', answer: 'Characters like zero-width spaces that cause comparison issues.' }
    ]
  },
  {
    slug: 'markdown-preview',
    title: 'Markdown Preview',
    description: 'Write and preview Markdown with real-time rendering and syntax highlighting.',
    category: 'generators',
    keywords: ['markdown', 'preview', 'render', 'formatting', 'documentation'],
    relatedSlugs: ['lorem-ipsum-generator', 'json-formatter', 'text-case-converter'],
    seoContent: `
## Markdown Preview

Write Markdown and see it rendered in real-time. Perfect for README files and documentation.

## Supported Syntax

- Headings
- Emphasis (italic, bold)
- Lists
- Links and Images
- Code blocks
- Tables
    `,
    faqItems: [
      { question: 'Which Markdown flavor is supported?', answer: 'GitHub-flavored Markdown (GFM) including tables and task lists.' },
      { question: 'Can I export the rendered HTML?', answer: 'Yes, use the "Copy HTML" button.' }
    ]
  }
];

/** Find a tool by slug */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/** Resolve related tools safely */
export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => Boolean(t));
}

/** Filter tools by category */
export function getToolsByCategory(categoryId: CategoryId): Tool[] {
  return tools.filter((t) => t.category === categoryId);
}

/** Search tools by title/description/keywords */
export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;

  return tools.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}