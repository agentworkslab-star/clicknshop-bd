'use server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function toggleSuspendAction(userId: string) {
  try {
    await requireAdmin();
    const u = await prisma.user.findUnique({ where: { id: userId } });
    if (!u) return { error: 'User not found' };
    await prisma.user.update({ where: { id: userId }, data: { isSuspended: !u.isSuspended } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}

export async function changeRoleAction(userId: string, role: 'USER' | 'ADMIN') {
  try {
    await requireAdmin();
    await prisma.user.update({ where: { id: userId }, data: { role } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await requireAdmin();
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch {
    return { error: 'Failed' };
  }
}