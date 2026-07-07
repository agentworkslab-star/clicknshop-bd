export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminUsersTable } from './users-table';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { products: true, contents: true } } },
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Users ({users.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AdminUsersTable users={users as any} />
      </CardContent>
    </Card>
  );
}