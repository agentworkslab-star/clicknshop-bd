export const dynamic = "force-dynamic";
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ProductsView } from './products-view';

export default async function ProductsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const products = await prisma.product.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bangla">Product Library</h1>
            <p className="text-sm text-muted-foreground bangla">আপনার সব প্রোডাক্ট এক জায়গায়</p>
          </div>
        </div>
        <Button asChild><Link href="/products/new"><Plus className="mr-2 h-4 w-4" /> নতুন প্রোডাক্ট</Link></Button>
      </div>
      <ProductsView initialProducts={products as any} />
    </div>
  );
}