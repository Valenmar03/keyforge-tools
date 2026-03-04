"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Shield,
  Code,
  Sparkles,
  Key,
  ChevronDown,
  Globe,
  Menu,
  X,
} from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { name: "Home", href: "/" },
  { name: "Tools", href: "/tools" },
  { name: "FAQ", href: "/faq" },
];

const categoryLinks = [
  { name: "Security", href: "/tools?category=security", icon: Shield },
  { name: "Dev Utilities", href: "/tools?category=dev-utilities", icon: Code },
  { name: "Generators", href: "/tools?category=generators", icon: Sparkles },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const isActive = useMemo(() => {
    return (href: string) => {
      // Simple active matching
      if (href === "/") return pathname === "/";
      return pathname?.startsWith(href);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              KeyForge<span className="text-blue-600">Tools</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) =>
              item.name === "Tools" ? (
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
                    {item.name}
                    <ChevronDown className="w-4 h-4" />
                  </Link>

                  {toolsDropdownOpen && (
                    <div className="absolute top-full left-0 pt-2">
                      <div className="bg-white border border-slate-200 rounded-xl shadow-lg py-2 min-w-[220px]">
                        <Link
                          href="/tools"
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          All Tools
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        {categoryLinks.map((cat) => (
                          <Link
                            key={cat.name}
                            href={cat.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <cat.icon className="w-4 h-4 text-slate-400" />
                            {cat.name}
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
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Language Toggle (Placeholder) */}
          <div className="hidden md:flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4" />
              EN
            </button>
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
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="px-3 py-1 text-xs font-medium text-slate-400 uppercase">
                  Categories
                </div>
                {categoryLinks.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
                  >
                    <cat.icon className="w-4 h-4 text-slate-400" />
                    {cat.name}
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