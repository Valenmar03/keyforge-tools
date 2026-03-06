import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { getTranslations } from "next-intl/server";

import ToolLayout from "@/components/tools/ToolLayout";
import {
  getToolBySlug,
  getToolText,
  type Locale,
  type Translator,
} from "@/lib/tools";

// Tool components
import ApiKeyGenerator from "@/components/tools/security/ApiKeyGenerator";
import BcryptHashGenerator from "@/components/tools/security/BcryptHashGenerator";
import PasswordGenerator from "@/components/tools/security/PasswordGenerator";
import PasswordStrengthChecker from "@/components/tools/security/PasswordStrengthChecker";
import RandomTokenGenerator from "@/components/tools/security/RandomTokenGenerator";
import JwtDecoder from "@/components/tools/security/JwtDecoder";

import UuidGenerator from "@/components/tools/devutils/UuidGenerator";
import JsonFormatter from "@/components/tools/devutils/JsonFormatter";
import Base64EncoderDecoder from "@/components/tools/devutils/Base64EncoderDecoder";
import UrlEncoderDecoder from "@/components/tools/devutils/UrlEncoderDecoder";
import TimestampConverter from "@/components/tools/devutils/TimesStampConverter";
import RegexTester from "@/components/tools/devutils/RegexTester";

import RandomStringGenerator from "@/components/tools/generators/RandomStringGenerator";
import LoremIpsumGenerator from "@/components/tools/generators/LoremIpsumGenerator";
import RandomNumberGenerator from "@/components/tools/generators/RandomNumberGenerator";
import RandomColorGenerator from "@/components/tools/generators/RandomColorGenerator";
import SlugifyText from "@/components/tools/generators/SlugifyText";
import TextCaseConverter from "@/components/tools/generators/TextCaseConverter";
import WhitespaceCleaner from "@/components/tools/generators/WhitespaceCleaner";
import MarkdownPreview from "@/components/tools/generators/MarkdownPreview";

const toolComponents: Record<string, ComponentType> = {
  "api-key-generator": ApiKeyGenerator,
  "bcrypt-hash-generator": BcryptHashGenerator,
  "password-generator": PasswordGenerator,
  "password-strength-checker": PasswordStrengthChecker,
  "random-token-generator": RandomTokenGenerator,
  "jwt-decoder": JwtDecoder,

  "uuid-generator": UuidGenerator,
  "json-formatter": JsonFormatter,
  "base64-encoder-decoder": Base64EncoderDecoder,
  "url-encoder-decoder": UrlEncoderDecoder,
  "timestamp-converter": TimestampConverter,
  "regex-tester": RegexTester,

  "random-string-generator": RandomStringGenerator,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "random-number-generator": RandomNumberGenerator,
  "random-color-generator": RandomColorGenerator,
  "slugify-text": SlugifyText,
  "text-case-converter": TextCaseConverter,
  "whitespace-cleaner": WhitespaceCleaner,
  "markdown-preview": MarkdownPreview,
};

type Params = { locale: Locale; slug: string };

// ✅ Server: metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  // ✅ Server translations (NO useTranslations acá)
  const tTools = (await getTranslations({
    locale,
    namespace: "toolsData",
  })) as unknown as Translator;

  const txt = getToolText(slug, tTools);
  if (!txt) return { title: "Tool Not Found" };

  const urlPath = `/${locale}/tools/${slug}`;

  return {
    title: `${txt.title} — Dev Toolkit`,
    description: txt.description,
    openGraph: {
      title: `${txt.title} — Dev Toolkit`,
      description: txt.description,
      url: urlPath,
    },
    alternates: {
      canonical: urlPath,
      languages: {
        es: `/es/tools/${slug}`,
        en: `/en/tools/${slug}`,
      },
    },
  };
}

// ✅ Server: page
export default async function ToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;

  const tTools = (await getTranslations({
    locale,
    namespace: "toolsData",
  })) as unknown as Translator;

  // ✅ tool ya viene localizado (title/desc/seo/faq) desde i18n
  const tool = getToolBySlug(slug, tTools);
  const ToolComponent = toolComponents[slug];

  if (!tool || !ToolComponent) notFound();

  return (
    <ToolLayout tool={tool} locale={locale}>
      <ToolComponent />
    </ToolLayout>
  );
}