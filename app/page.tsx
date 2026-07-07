import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Sparkles, ArrowRight, Brain, BookOpen, Tag, Zap, Check, Smartphone,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER — dark glass */}
      <header className="sticky top-0 z-50 bg-surface-2/80 backdrop-blur-xl border-b border-default">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-brand-gradient flex items-center justify-center glow-blue">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-base text-primary leading-tight">ClickNShop.bd</div>
              <div className="text-[10px] text-secondary leading-tight bangla">AI মার্কেটিং ওয়ার্কস্পেস</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard" className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-secondary hover:bg-glass-hover hover:text-primary transition-colors">
              <Brain className="mr-1.5 h-4 w-4" /> ড্যাশবোর্ড
            </Link>
            <Link href="/dashboard" className="inline-flex h-9 items-center justify-center rounded-md bg-brand-gradient px-4 text-sm font-semibold text-white hover:opacity-90 glow-blue">
              শুরু করুন
            </Link>
          </div>
        </div>
      </header>

      {/* HERO — dark with green primary accent */}
      <section className="relative overflow-hidden border-b border-default">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-blue/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-purple/10 blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-default bg-glass px-3 py-1.5 text-xs text-secondary backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-accent-blue" /> Bangla marketing workspace
              </div>
              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-primary bangla">
                বাংলা অ্যাড স্ক্রিপ্ট, হুক ও কন্টেন্ট প্ল্যান এক জায়গায়।
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg leading-7 text-secondary bangla">
                আপনার ব্র্যান্ড ভয়েস, কপিরাইটিং ফ্রেমওয়ার্ক এবং প্ল্যাটফর্ম অনুযায়ী
                দ্রুত ব্যবহারযোগ্য Bangla ও Bangla-English কপি তৈরি করুন।
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-gradient px-8 text-base font-semibold text-white hover:opacity-90 glow-blue">
                  ফ্রি শুরু করুন <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/dashboard" className="inline-flex h-12 items-center justify-center rounded-lg border border-default bg-glass px-8 text-base font-semibold text-primary hover:bg-glass-hover">
                  সাইন ইন
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  'Brand memory',
                  'Framework-guided',
                  'Ready for Reels',
                ].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-secondary">
                    <Check className="h-4 w-4 text-accent-green" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: macOS-style Mockup */}
            <div className="relative">
              <div className="rounded-xl border border-default bg-surface-2 shadow-card overflow-hidden">
                {/* Window header */}
                <div className="flex h-8 items-center justify-between border-b border-default bg-surface-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-secondary">Content Writer Pro · ClickNShop.bd</span>
                  <div className="w-12" />
                </div>
                {/* Window body */}
                <div className="grid grid-cols-2 divide-x divide-default">
                  {/* Left panel — Input */}
                  <div className="p-4 space-y-3 bg-surface-2">
                    {[
                      { label: 'PRODUCT', value: 'GlowBD Barrier Cream' },
                      { label: 'AUDIENCE', value: 'Working women, Dhaka' },
                      { label: 'TONE', value: 'Trustworthy, conversational' },
                    ].map(f => (
                      <div key={f.label} className="border-b border-default pb-3 last:border-0">
                        <div className="text-[10px] uppercase tracking-wider text-muted font-medium">{f.label}</div>
                        <div className="text-sm font-medium text-primary mt-1">{f.value}</div>
                      </div>
                    ))}
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted font-medium">FRAMEWORKS</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {['PAS', 'AIDA', 'Story'].map(f => (
                          <span key={f} className="rounded bg-accent-blue/20 px-2 py-0.5 text-[10px] font-medium text-accent-blue border border-accent-blue/30">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Right panel — Output */}
                  <div className="p-4 space-y-2 bg-surface-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Generated draft</div>
                      <span className="rounded-full bg-accent-green/20 px-2 py-0.5 text-[10px] font-semibold text-accent-green border border-accent-green/30">Ready</span>
                    </div>
                    <div className="rounded-lg border border-default bg-surface-2 p-3 space-y-2">
                      {[
                        { label: 'Hook 1', text: 'আপনার skincare routine ঠিক, কিন্তু barrier কি ঠিক আছে?' },
                        { label: 'Problem', text: 'দাগ, dryness আর dullness অনেক সময় cream বদলালেই ঠিক হয় না।' },
                        { label: 'CTA', text: 'আজই GlowBD Barrier Cream try করুন' },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="text-[9px] uppercase tracking-wider text-accent-blue font-bold">{item.label}</div>
                          <div className="text-[11px] text-secondary leading-snug">{item.text}</div>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-default mt-1">
                        <div className="text-[9px] uppercase tracking-wider text-accent-blue font-bold">30s script rhythm</div>
                        <div className="text-[10px] text-secondary">Hook → Pain → Proof → CTA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 4 step cards */}
      <section className="py-20 bg-surface border-b border-default">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-accent-blue font-semibold">কাজের প্রক্রিয়া</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-primary bangla">কাজের প্রক্রিয়া</h2>
            <p className="mx-auto mt-4 max-w-2xl text-secondary bangla">
              ভালো কপি শুধু prompt থেকে আসে না। ClickNShop.bd ব্র্যান্ড, স্ট্রাকচার এবং আউটপুটকে একই workflow-তে রাখে।
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '01', title: 'ব্র্যান্ড সেট করুন', desc: 'Voice, audience pain, offers এবং winning references মেমরিতে রাখুন।', Icon: Brain },
              { n: '02', title: 'ফ্রেমওয়ার্ক বাছুন', desc: 'AIDA, PAS, Hormozi, Storytelling বা নিজের uploaded guide ব্যবহার করুন।', Icon: BookOpen },
              { n: '03', title: 'স্ক্রিপ্ট তৈরি করুন', desc: 'Hooks, body copy, CTA, captions এবং hashtag একসাথে পান।', Icon: Zap },
              { n: '04', title: 'সেভ ও রিইউজ করুন', desc: 'Winning output সংরক্ষণ করুন এবং পরের campaign-এ variant বানান।', Icon: Save },
            ].map(({ n, title, desc, Icon }) => (
              <div key={n} className="card p-6 card-interactive">
                <div className="text-3xl font-bold text-gradient">{n}</div>
                <Icon className="mt-3 h-6 w-6 text-accent-blue" />
                <h3 className="mt-3 text-lg font-semibold text-primary bangla">{title}</h3>
                <p className="mt-1 text-sm text-secondary bangla">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — 3 alternating sections */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-wider text-accent-blue font-semibold">Features</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-primary bangla">যে অংশগুলো কাজের মান ঠিক রাখে</h2>
            <p className="mx-auto mt-4 max-w-2xl text-secondary bangla">
              প্রতিটি feature আলাদা gimmick না; এগুলো একসাথে আপনার content workflow তৈরি করে।
            </p>
          </div>
          <div className="mt-16 space-y-16">
            {[
              {
                title: 'Brand Memory', desc: 'বারবার context লিখতে হয় না। আপনার tone, offer, objections ও audience data ভবিষ্যতের generation-এ ব্যবহার হয়।',
                mockup: (
                  <div className="card p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-primary"><Brain className="h-4 w-4 text-accent-blue" /> Memory profile</div>
                      <span className="rounded-full bg-accent-blue/20 px-2 py-0.5 text-[10px] font-semibold text-accent-blue border border-accent-blue/30">Pinned</span>
                    </div>
                    {['Brand tone: calm, practical, trustworthy', 'Audience pain: confused by fake claims', 'Winning CTA: Message us for help'].map((t, i) => (
                      <div key={i} className="rounded-lg border border-default bg-surface-2 p-3 text-sm text-secondary">{t}</div>
                    ))}
                  </div>
                ),
                icon: Brain, ctaLink: '/brand',
              },
              {
                title: 'Framework Brain', desc: 'নিজের copywriting notes, hook libraries এবং proven structures upload করে output consistent রাখুন।',
                mockup: (
                  <div className="card p-6 space-y-3">
                    <div className="font-semibold flex items-center gap-2 text-primary"><BookOpen className="h-4 w-4 text-accent-blue" /> Framework stack</div>
                    {['PAS — Problem, agitation, solution', 'AIDA — Attention, interest, desire, action', 'Hormozi — Value equation and proof'].map((t, i) => (
                      <div key={i} className="rounded-lg border border-default bg-surface-2 p-3 text-sm text-secondary">{t}</div>
                    ))}
                  </div>
                ),
                icon: BookOpen, ctaLink: '/ai-writer', reverse: true,
              },
              {
                title: 'Content Writer Pro', desc: 'একই input থেকে platform-ready hooks, script, CTA, caption এবং performance notes তৈরি করুন।',
                mockup: (
                  <div className="card p-6 space-y-3">
                    <div className="font-semibold flex items-center gap-2 text-primary"><Tag className="h-4 w-4 text-accent-blue" /> Output package</div>
                    {['3 hooks — Curiosity, pain-led, proof-led', 'Full script — Scene-by-scene ad copy', 'Caption + CTA — Ready to post'].map((t, i) => (
                      <div key={i} className="rounded-lg border border-default bg-surface-2 p-3 text-sm text-secondary">{t}</div>
                    ))}
                  </div>
                ),
                icon: Tag, ctaLink: '/ai-writer',
              },
            ].map((f, i) => (
              <div key={i} className={`grid items-center gap-12 md:grid-cols-2 ${f.reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gradient text-white glow-blue">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-primary bangla">{f.title}</h3>
                  <p className="mt-2 text-secondary bangla">{f.desc}</p>
                  <Link href={f.ctaLink} className="mt-4 inline-flex items-center gap-1 text-accent-blue font-semibold hover:gap-2 transition-all">
                    Try this workflow <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                {f.mockup}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA + PWA */}
      <section className="py-20 bg-surface border-t border-default">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary bangla">আজকের campaign draft শুরু করুন।</h2>
          <p className="mt-3 text-secondary bangla">
            Free workspace দিয়ে শুরু করুন। আপনার ব্র্যান্ড মেমরি তৈরি হলে output দ্রুত আরও consistent হবে।
          </p>
          <Link href="/dashboard" className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-brand-gradient px-8 text-base font-semibold text-white hover:opacity-90 glow-blue">
            ফ্রি শুরু করুন <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <div className="mt-12 card p-6 text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
                <Smartphone className="h-5 w-5 text-accent-blue" />
              </div>
              <h3 className="font-semibold text-primary bangla">অ্যাপ ইনস্টল করুন</h3>
            </div>
            <p className="text-sm text-secondary bangla">ইনস্টলযোগ্য ওয়েব অ্যাপ — কোনো Play Store / App Store লাগবে না, ব্রাউজার থেকে সরাসরি ইনস্টল হবে।</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-default bg-surface-2 py-8 text-center text-xs text-muted">
        © 2026 ClickNShop.bd · বাংলাদেশি ক্রিয়েটর ও ই-কমার্স ব্র্যান্ডদের জন্য তৈরি
      </footer>
    </div>
  );
}

import { Save } from 'lucide-react';
