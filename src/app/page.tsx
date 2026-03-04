"use client";

import Link from "next/link";
import { 
  Shield, Code, Sparkles, Search, ArrowRight, Lock, 
  Zap, Eye, Key, Hash, FileJson, Link2, Clock, 
  Regex, Type, Palette, FileText, CheckCircle
} from 'lucide-react';
import { useMemo, useState } from "react";
import { categories, tools } from "@/lib/tools";
import ToolCard from "@/components/tools/ToolCard";

const categoryIcons = {
  security: Shield,
  'dev-utilities': Code,
  generators: Sparkles
};

const categoryColors = {
  security: 'from-blue-500 to-indigo-600',
  'dev-utilities': 'from-emerald-500 to-teal-600',
  generators: 'from-violet-500 to-purple-600'
};

export default function Home() {

  const [searchQuery, setSearchQuery] = useState('');

  const popularTools = tools.slice(0, 6);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return tools.filter(tool => 
      tool.title.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.keywords.some(k => k.toLowerCase().includes(query))
    ).slice(0, 8);
  }, [searchQuery]);


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-28 ">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 mb-8">
              <Lock className="w-4 h-4" />
              <span>100% Client-Side • No Data Leaves Your Browser</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Fast, Private Tools for
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Developers</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Secure password generators, JSON formatters, encoders, and 20+ developer utilities. 
              Everything runs locally in your browser—your data never leaves your device.
            </p>

            {/* Search Box */}
            <div className="relative max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tools... (e.g., password, json, base64)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-lg shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Search Results Dropdown */}
              {filteredTools.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {filteredTools.map(tool => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${categoryColors[tool.category]} flex items-center justify-center`}>
                        <Key className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-900">{tool.title}</div>
                        <div className="text-sm text-slate-500 truncate">{tool.description}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-6 mt-8">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Browse All Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#categories" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                View Categories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Popular Tools</h2>
              <p className="text-slate-600 mt-2">Most used developer utilities</p>
            </div>
            <Link 
              href="/tools"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tool Categories</h2>
            <p className="text-slate-600 mt-2">Organized by use case</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map(cat => {
              const Icon = categoryIcons[cat.id];
              const toolCount = tools.filter(t => t.category === cat.id).length;
              
              return (
                <Link
                  key={cat.id}
                  href={`/tools?category=${cat.id}`}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:shadow-slate-200/50 hover:border-slate-300 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[cat.id]} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{cat.name}</h3>
                  <p className="text-slate-600 mb-4">{cat.description}</p>
                  <div className="flex items-center text-sm text-slate-500">
                    <span>{toolCount} tools</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Privacy First</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              All tools run entirely in your browser using JavaScript. No data is ever sent to any server. 
              No analytics, no tracking, no cookies. Your passwords, tokens, and sensitive data stay on your device.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['No Server Calls', 'No Analytics', 'No Cookies', 'Open Algorithms'].map(item => (
                <div key={item} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Why KeyForge Tools?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Instant Results', desc: 'No loading, no waiting. Results appear as you type.' },
              { icon: Lock, title: 'Cryptographically Secure', desc: 'Uses crypto.getRandomValues() for true randomness.' },
              { icon: Eye, title: 'No Tracking', desc: 'Zero analytics or third-party scripts.' },
              { icon: Code, title: 'Developer Focused', desc: 'Built by developers, for developers.' }
            ].map(item => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <item.icon className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
          <p className="text-slate-600 mb-8">Explore our full collection of developer tools.</p>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
          >
            Explore All Tools
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

