export const dynamic = "force-dynamic";
import { Users, FileText, FolderOpen, Activity, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

export default async function AdminOverviewPage() {
  const [
    userCount, productCount, contentCount, folderCount,
    recentUsers, recentContent, logs, templateStats,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.generatedContent.count(),
    prisma.folder.count(),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, brandName: true, email: true, createdAt: true, role: true } }),
    prisma.generatedContent.findMany({
      orderBy: { createdAt: 'desc' }, take: 5,
      include: { user: { select: { brandName: true } }, product: { select: { name: true } } },
    }),
    prisma.usageLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { brandName: true } } } }),
    prisma.generatedContent.groupBy({ by: ['templateType'], _count: true, orderBy: { _count: { templateType: 'desc' } } }),
  ]);

  const totalTokens = await prisma.usageLog.aggregate({ _sum: { tokensUsed: true } });

  const stats = [
    { label: 'Total Users', value: userCount, icon: Users, color: 'text-blue-500' },
    { label: 'Products', value: productCount, icon: FileText, color: 'text-purple-500' },
    { label: 'Contents', value: contentCount, icon: Sparkles, color: 'text-green-500' },
    { label: 'Folders', value: folderCount, icon: FolderOpen, color: 'text-indigo-500' },
    { label: 'API Calls', value: logs.length, icon: Activity, color: 'text-red-500' },
    { label: 'Total Tokens', value: totalTokens._sum.tokensUsed || 0, icon: TrendingUp, color: 'text-violet-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Users</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentUsers.map(u => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{u.brandName}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="text-xs">
                    {u.role === 'ADMIN' ? <span className="text-red-500 font-semibold">ADMIN</span> : <span className="text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Popular Templates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {templateStats.map(t => (
                <div key={t.templateType} className="flex items-center justify-between text-sm">
                  <span>{t.templateType.replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{t._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Recent API Calls</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.map(l => (
                <div key={l.id} className="flex items-center justify-between text-sm border-b pb-1">
                  <div>
                    <p className="font-medium">{l.templateType}</p>
                    <p className="text-xs text-muted-foreground">by {l.user?.brandName || 'unknown'} · {l.modelUsed}</p>
                  </div>
                  <div className="text-xs text-right">
                    <p>{l.tokensUsed} tokens · {l.durationMs}ms</p>
                    <p className="text-muted-foreground">{new Date(l.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}