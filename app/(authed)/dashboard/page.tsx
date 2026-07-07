export const dynamic = "force-dynamic";
import Link from 'next/link';
import { Plus, PenTool, Image as ImageIcon, FolderOpen, Package, FileText, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TEMPLATE_LABELS, timeAgo } from '@/lib/utils';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [productCount, contentCount, savedCount, thisMonthCount, recentContent] = await Promise.all([
    prisma.product.count({ where: { userId: user.id } }),
    prisma.generatedContent.count({ where: { userId: user.id } }),
    prisma.generatedContent.count({ where: { userId: user.id, isFavorite: true } }),
    prisma.usageLog.count({
      where: { userId: user.id, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
    prisma.generatedContent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { product: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: 'মোট প্রোডাক্ট', value: productCount, icon: Package, gradient: 'from-blue-500 to-cyan-500', glow: 'glow-blue' },
    { label: 'তৈরি করা কন্টেন্ট', value: contentCount, icon: FileText, gradient: 'from-green-500 to-emerald-500', glow: '' },
    { label: 'সেভ করা প্রজেক্ট', value: savedCount, icon: FolderOpen, gradient: 'from-indigo-500 to-purple-500', glow: '' },
    { label: 'API কল (এই মাসে)', value: thisMonthCount, icon: Sparkles, gradient: 'from-pink-500 to-rose-500', glow: '' },
  ];

  const quickActions = [
    { href: '/products/new', icon: Plus, labelBn: 'নতুন প্রোডাক্ট', gradient: 'from-blue-500 to-cyan-500' },
    { href: '/ai-writer', icon: PenTool, labelBn: 'AI রাইটার', gradient: 'from-violet-500 to-purple-500' },
    { href: '/image-prompt', icon: ImageIcon, labelBn: 'ইমেজ প্রম্পট', gradient: 'from-pink-500 to-rose-500' },
    { href: '/projects', icon: FolderOpen, labelBn: 'সেভড প্রজেক্ট', gradient: 'from-indigo-500 to-blue-500' },
  ];

  const firstName = (user.brandName || 'User').split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Welcome Hero — DARK with brand gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-8 md:p-10 text-white glow-blue">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" /> AI-Powered Business Platform
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bangla">
            স্বাগতম, {firstName}! 👋
          </h1>
          <p className="opacity-90 mt-2 bangla max-w-2xl">
            আজ কী তৈরি করবেন? Brand Memory থেকে শুরু করুন — AI আপনার context বুঝে content generate করবে।
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className={`hover:-translate-y-1 transition-transform duration-300 ${s.glow}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-secondary uppercase tracking-wider font-medium">{s.label}</p>
                  <p className="text-4xl font-bold mt-2 text-primary">{s.value}</p>
                </div>
                <div className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="bangla text-xl">দ্রুত শুরু করুন</CardTitle>
              <CardDescription className="bangla">এক ক্লিকে যেকোনো feature access করুন</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-accent-blue" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className={`group relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br ${a.gradient} hover:scale-105 transition-transform duration-200 shadow-lg`}
              >
                <a.icon className="h-8 w-8 mb-3" />
                <div className="font-bold bangla text-base">{a.labelBn}</div>
                <ArrowRight className="absolute right-4 top-4 h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Content */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="bangla text-xl">সাম্প্রতিক Generated Content</CardTitle>
            <CardDescription className="bangla">গত ৫টি তৈরি করা content</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="border-default text-secondary hover:bg-glass-hover">
            <Link href="/projects">সব দেখুন <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentContent.length === 0 ? (
            <div className="text-center py-16 text-muted">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-glass flex items-center justify-center">
                <FileText className="h-10 w-10 text-muted" />
              </div>
              <p className="bangla mb-4 text-primary">এখনো কোনো content তৈরি করা হয়নি</p>
              <Button asChild className="bg-brand-gradient hover:opacity-90">
                <Link href="/ai-writer">প্রথম content তৈরি করুন <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentContent.map(c => {
                const t = TEMPLATE_LABELS[c.templateType];
                return (
                  <Link
                    key={c.id}
                    href={`/projects/${c.id}`}
                    className="flex items-start gap-4 p-4 rounded-lg bg-glass border border-default hover:border-accent-blue/50 hover:bg-glass-hover transition-all group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
                      <PenTool className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-primary">{t?.label || c.templateType}</span>
                        <Badge variant="outline" className="text-[10px] border-default text-secondary">{c.language}</Badge>
                      </div>
                      <p className="text-xs text-secondary line-clamp-2">{c.outputText}</p>
                      <p className="text-xs text-muted mt-1">
                        {timeAgo(c.createdAt)}
                        {c.product && ` · ${c.product.name}`}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent-blue group-hover:translate-x-1 transition-all shrink-0 mt-3" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
