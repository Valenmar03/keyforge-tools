"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Shield, Code, Sparkles, Key, ChevronDown, Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const locale = useLocale(); // ✅ adentro del componente
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const t = useTranslations("common");
  const tFooter = useTranslations("footer");

  const navItems = useMemo(
    () =>
      [
        { name: "home", href: `/${locale}` },
        { name: "tools", href: `/${locale}/tools` },
        { name: "faq", href: `/${locale}/faq` }
      ] as const,
    [locale]
  );

  const categoryLinks = useMemo(
    () =>
      [
        { id: "security", href: `/${locale}/tools?category=security`, icon: Shield },
        { id: "devUtilities", href: `/${locale}/tools?category=dev-utilities`, icon: Code },
        { id: "generators", href: `/${locale}/tools?category=generators`, icon: Sparkles }
      ] as const,
    [locale]
  );

  const isActive = useMemo(() => {
    return (href: string) => pathname?.startsWith(href);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Dev
              <span className="text-blue-600"> Toolkit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.name === "tools" ? (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setToolsDropdownOpen(true)}
                  onMouseLeave={() => setToolsDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-blue-600"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {t(item.name)}
                    <ChevronDown className="w-4 h-4" />
                  </Link>

                  {toolsDropdownOpen && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2 min-w-[220px]">
                        <Link
                          href={`/${locale}/tools`}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {t("allTools")}
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        {categoryLinks.map((cat) => (
                          <Link
                            key={cat.id}
                            href={cat.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <cat.icon className="w-4 h-4 text-slate-400" />
                            {cat.id === "security" && tFooter("categorySecurity")}
                            {cat.id === "devUtilities" && tFooter("categoryDevUtilities")}
                            {cat.id === "generators" && tFooter("categoryGenerators")}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t(item.name)}
                </Link>
              )
            )}
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-600" />
            ) : (
              <Menu className="w-6 h-6 text-slate-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-lg text-sm font-medium",
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {t(item.name)}
                </Link>
              ))}

              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="px-3 py-1 text-xs font-medium text-slate-400 uppercase">
                  {t("categories")}
                </div>
                {categoryLinks.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    <cat.icon className="w-4 h-4 text-slate-400" />
                    {cat.id === "security" && tFooter("categorySecurity")}
                    {cat.id === "devUtilities" && tFooter("categoryDevUtilities")}
                    {cat.id === "generators" && tFooter("categoryGenerators")}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}