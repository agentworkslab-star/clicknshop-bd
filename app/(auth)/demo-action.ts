'use server';
import { redirect } from 'next/navigation';
import { createToken, setSessionCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// BYPASS MODE: One-click demo login (no credentials needed)
const DEMO_PHONE = '01800000000';

export async function demoLoginAction() {
  const user = await prisma.user.findUnique({ where: { whatsappNumber: DEMO_PHONE } });
  if (!user) {
    redirect('/dashboard');  // bypass still works — go to dashboard
  }
  const token = await createToken({ userId: user.id, email: user.email || '', role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN' });
  await setSessionCookie(token);
  redirect('/dashboard');
}
