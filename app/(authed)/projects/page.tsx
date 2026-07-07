export const dynamic = "force-dynamic";
import { FolderOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { ProjectsView } from './projects-view';

export default async function ProjectsPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const [contents, folders] = await Promise.all([
    prisma.generatedContent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true } } },
    }),
    prisma.folder.findMany({ where: { userId: user.id }, orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bangla">Saved Projects</h1>
          <p className="text-sm text-muted-foreground bangla">{contents.length}টি saved content · {folders.length}টি folder</p>
        </div>
      </div>
      <ProjectsView
        initialContent={contents.map(c => ({ ...c, createdAt: c.createdAt.toISOString() })) as any}
        folders={folders}
      />
    </div>
  );
}