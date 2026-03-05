import Link from "next/link";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50/60 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-[2fr,1fr,1fr] text-sm text-slate-600">
        <div className="space-y-3">
          <div className="text-base font-semibold text-slate-900">
            KeyForge<span className="text-blue-600">Tools</span>
          </div>
          <p className="text-slate-500">
            A curated collection of developer utilities for security, text
            processing, and everyday workflows — all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            <Link
              href="/"
              className="block hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/tools"
              className="block hover:text-slate-900 transition-colors"
            >
              All tools
            </Link>
            <Link
              href="/faq"
              className="block hover:text-slate-900 transition-colors"
            >
              FAQ
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase mb-3">
            Resources
          </h3>
          <div className="space-y-1">
            <p className="text-slate-500">
              Found a bug or have an idea for a new tool?{" "}
              <span className="block">
                Reach out via your preferred channel or open an issue in the
                project repository.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs text-slate-500">
          <p>© {year} KeyForge Tools. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400">Made for developers.</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Categories:</span>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/tools?category=security"
                  className="hover:text-slate-900 transition-colors"
                >
                  Security
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/tools?category=dev-utilities"
                  className="hover:text-slate-900 transition-colors"
                >
                  Dev Utilities
                </Link>
                <span className="text-slate-300">•</span>
                <Link
                  href="/tools?category=generators"
                  className="hover:text-slate-900 transition-colors"
                >
                  Generators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

