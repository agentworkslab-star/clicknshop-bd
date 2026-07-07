'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { stringifyStringArray, parseStringArray } from '@/lib/db-helpers';

const folderSchema = z.object({ name: z.string().min(1).max(50), color: z.string().default('#6366F1') });

export async function createFolderAction(prevState: any, fd: FormData): Promise<{ error?: string; success?: string }> {
  try {
    const user = await requireUser();
    const data = folderSchema.parse({ name: fd.get('name'), color: fd.get('color') || '#6366F1' });
    await prisma.folder.create({ data: { name: data.name, color: data.color, userId: user.id } });
    revalidatePath('/projects');
    return { success: 'Folder তৈরি হয়েছে!' };
  } catch {
    return { error: 'তৈরি ব্যর্থ' };
  }
}

export async function deleteFolderAction(id: string) {
  try {
    const user = await requireUser();
    await prisma.folder.delete({ where: { id, userId: user.id } });
    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { error: 'Delete failed' };
  }
}

export async function moveToFolderAction(contentId: string, folderId: string | null) {
  try {
    const user = await requireUser();
    await prisma.generatedContent.update({
      where: { id: contentId, userId: user.id },
      data: { folderId: folderId || null },
    });
    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { error: 'Move failed' };
  }
}

export async function toggleFavoriteAction(contentId: string) {
  try {
    const user = await requireUser();
    const content = await prisma.generatedContent.findUnique({ where: { id: contentId, userId: user.id } });
    if (!content) return { error: 'Not found' };
    await prisma.generatedContent.update({
      where: { id: contentId },
      data: { isFavorite: !content.isFavorite },
    });
    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { success: true, isFavorite: !content.isFavorite };
  } catch {
    return { error: 'Toggle failed' };
  }
}

export async function deleteContentAction(contentId: string) {
  try {
    const user = await requireUser();
    await prisma.generatedContent.delete({ where: { id: contentId, userId: user.id } });
    revalidatePath('/projects');
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Delete failed' };
  }
}

export async function deleteBulkAction(contentIds: string[]) {
  try {
    const user = await requireUser();
    await prisma.generatedContent.deleteMany({
      where: { id: { in: contentIds }, userId: user.id },
    });
    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { error: 'Bulk delete failed' };
  }
}

export async function updateContentAction(contentId: string, text: string) {
  try {
    const user = await requireUser();
    await prisma.generatedContent.update({
      where: { id: contentId, userId: user.id },
      data: { outputText: text },
    });
    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { error: 'Update failed' };
  }
}

export async function duplicateContentAction(contentId: string) {
  try {
    const user = await requireUser();
    const content = await prisma.generatedContent.findUnique({ where: { id: contentId, userId: user.id } });
    if (!content) return { error: 'Not found' };
    const { id, createdAt, updatedAt, inputData, tags, ...rest } = content;
    await prisma.generatedContent.create({
      data: { ...rest, inputData, tags },
    });
    revalidatePath('/projects');
    return { success: true };
  } catch {
    return { error: 'Duplicate failed' };
  }
}