import { Package } from 'lucide-react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { EditProductForm } from './edit-product-form';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return null;
  const product = await prisma.product.findUnique({
    where: { id: params.id, userId: user.id },
  });
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">প্রোডাক্ট এডিট</h1>
          <p className="text-sm text-muted-foreground bangla">{product.name}</p>
        </div>
      </div>
      <EditProductForm productId={params.id} initial={product as any} />
    </div>
  );
}