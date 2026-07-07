export const dynamic = "force-dynamic";
import { Image as ImageIcon } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ImagePromptView } from './image-prompt-view';

export default async function ImagePromptPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [products, brand] = await Promise.all([
    prisma.product.findMany({ where: { userId: user.id }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    prisma.brandMemory.findUnique({ where: { userId: user.id } }),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <ImageIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">Image Prompt Generator</h1>
          <p className="text-sm text-muted-foreground bangla">Midjourney / DALL-E / Leonardo-এর জন্য prompt — শুধু text output</p>
        </div>
      </div>
      <ImagePromptView products={products} brand={brand} />
    </div>
  );
}