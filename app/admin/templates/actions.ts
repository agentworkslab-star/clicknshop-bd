'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  systemPrompt: z.string().min(10),
  isActive: z.boolean().default(true),
  icon: z.string().default('FileText'),
});

export async function updateTemplateAction(id: string, prev: any, fd: FormData): Promise<{ error?: string; success?: string }> {
  try {
    await requireAdmin();
    const data = templateSchema.parse({
      name: fd.get('name'),
      description: fd.get('description') || undefined,
      systemPrompt: fd.get('systemPrompt'),
      isActive: fd.get('isActive') === 'true',
      icon: fd.get('icon') || 'FileText',
    });
    await prisma.template.update({ where: { id }, data });
    revalidatePath('/admin/templates');
    return { success: 'Template updated!' };
  } catch (e: any) {
    return { error: e?.issues?.[0]?.message || 'Update failed' };
  }
}

export async function toggleTemplateActiveAction(id: string) {
  try {
    await requireAdmin();
    const t = await prisma.template.findUnique({ where: { id } });
    if (!t) return { error: 'Not found' };
    await prisma.template.update({ where: { id }, data: { isActive: !t.isActive } });
    revalidatePath('/admin/templates');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}