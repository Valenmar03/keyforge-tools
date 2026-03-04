"use client";

import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/faq";

export default function FaqPage() {
  // JSON-LD FAQ schema (SEO)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-10 pb-12 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-medium">FAQ</span>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600">
            Learn about our privacy practices, how the tools work, and why you can trust them.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white border border-slate-200 rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-slate-900">{faq.question}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-slate-600 pb-5">
                    <div className="pl-14">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Privacy Summary */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-3">Privacy First, Always</h2>
            <p className="text-slate-300 max-w-xl mx-auto">
              Every tool on KeyForge Tools processes your data locally in your browser.
              No server calls, no analytics, no tracking. Your data stays on your device.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Ready to use our tools?
          </h2>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Explore All Tools
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}