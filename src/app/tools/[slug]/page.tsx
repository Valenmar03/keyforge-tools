import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

import ToolLayout from "@/components/tools/ToolLayout";
import { getToolBySlug } from "@/lib/tools";

// Tool components (ideal: que cada uno sea client component si usa hooks)
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

type Params = { slug: string };

// ✅ Next 15: params puede ser Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.title} — KeyForge Tools`,
    description: tool.description,
    openGraph: {
      title: `${tool.title} — KeyForge Tools`,
      description: tool.description,
      url: `/tools/${tool.slug}`,
    },
  };
}

// ✅ También soporta params Promise acá (por si Next te lo exige)
export default async function ToolPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const tool = getToolBySlug(slug);
  const ToolComponent = tool ? toolComponents[slug] : undefined;

  if (!tool || !ToolComponent) notFound();

  return (
    <ToolLayout tool={tool}>
      <ToolComponent />
    </ToolLayout>
  );
}