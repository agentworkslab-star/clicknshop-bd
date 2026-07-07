export const dynamic = "force-dynamic";
import { Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function AdminLogsPage() {
  const logs = await prisma.usageLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: { user: { select: { brandName: true, email: true } } },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> System Logs (last 200)</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y max-h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground bangla">কোনো log নেই</p>
          ) : logs.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-3 text-sm">
              <Badge variant={l.success ? 'default' : 'destructive'} className="shrink-0">
                {l.success ? 'OK' : 'ERR'}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{l.templateType}</p>
                <p className="text-xs text-muted-foreground">{l.user?.brandName || 'system'} · {l.modelUsed}</p>
              </div>
              <div className="text-xs text-right shrink-0">
                <p>{l.tokensUsed} tokens · {l.durationMs}ms</p>
                <p className="text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}