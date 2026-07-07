export const dynamic = "force-dynamic";
import { FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminTemplatesEditor } from './templates-editor';

export default async function AdminTemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: { slug: 'asc' } });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> AI Templates ({templates.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <AdminTemplatesEditor templates={templates} />
      </CardContent>
    </Card>
  );
}