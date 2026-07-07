export const dynamic = "force-dynamic";
import { Suspense } from 'react';
import { PenTool } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { AIWriterView } from './ai-writer-view';

export default async function AIWriterPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [products, brand] = await Promise.all([
    prisma.product.findMany({ where: { userId: user.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.brandMemory.findUnique({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <PenTool className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">AI Writer</h1>
          <p className="text-sm text-muted-foreground bangla">৭টি template দিয়ে content generate করুন</p>
        </div>
      </div>
      <Suspense fallback={<div className="text-center text-muted-foreground bangla p-8">Loading...</div>}>
        <AIWriterView products={products} brand={brand} />
      </Suspense>
    </div>
  );
}