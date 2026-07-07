export const dynamic = "force-dynamic";
import { Building2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { BrandForm } from './brand-form';

export default async function BrandPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const brand = await prisma.brandMemory.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">Brand Memory</h1>
          <p className="text-sm text-muted-foreground bangla">একবার brand setup করুন, বারবার লিখতে হবে না</p>
        </div>
      </div>
      <BrandForm initial={brand} />
    </div>
  );
}