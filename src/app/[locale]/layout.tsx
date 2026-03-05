import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const messagesMap = {
    es: (await import("../../../messages/es.json")).default,
    en: (await import("../../../messages/en.json")).default
  } as const;

  const messages = messagesMap[locale as "es" | "en"];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}