'use server';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, createToken, setSessionCookie } from '@/lib/auth';
import { generateRandomString } from '@/lib/utils';

// Document 3 Section 5/7: WhatsApp + password auth
const loginSchema = z.object({
  whatsappNumber: z.string().min(11, 'সঠিক WhatsApp নাম্বার দিন (01XXXXXXXXX)'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
});

const registerSchema = z.object({
  brandName: z.string().min(2, 'ব্র্যান্ডের নাম দিতে হবে').max(100),
  whatsappNumber: z.string().min(11, 'সঠিক WhatsApp নাম্বার দিন (01XXXXXXXXX)'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর'),
  referralCode: z.string().optional().or(z.literal('')),
}).refine(d => d.password.length >= 6, { message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর', path: ['password'] });

export type AuthState = { error?: string; success?: string } | undefined;

export async function loginAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const data = loginSchema.parse({
      whatsappNumber: formData.get('whatsappNumber'),
      password: formData.get('password'),
    });

    const user = await prisma.user.findUnique({ where: { whatsappNumber: data.whatsappNumber } });
    if (!user || user.isSuspended) {
      return { error: 'WhatsApp নাম্বার বা পাসওয়ার্ড ভুল' };
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return { error: 'WhatsApp নাম্বার বা পাসওয়ার্ড ভুল' };
    }

    const token = await createToken({ userId: user.id, email: user.email, role: (user.role === 'ADMIN' ? 'ADMIN' : 'USER') as 'USER' | 'ADMIN' });
    await setSessionCookie(token);
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' };
  }
  redirect('/dashboard');
}

export async function registerAction(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const data = registerSchema.parse({
      brandName: formData.get('brandName'),
      whatsappNumber: formData.get('whatsappNumber'),
      password: formData.get('password'),
      referralCode: formData.get('referralCode') || undefined,
    });

    const exists = await prisma.user.findUnique({ where: { whatsappNumber: data.whatsappNumber } });
    if (exists) {
      return { error: 'এই WhatsApp নাম্বার দিয়ে আগেই account আছে' };
    }

    const passwordHash = await hashPassword(data.password);
    const ownReferralCode = generateRandomString(8).toUpperCase();

    const user = await prisma.user.create({
      data: {
        brandName: data.brandName,
        whatsappNumber: data.whatsappNumber,
        email: `${data.whatsappNumber}@clicknshop.bd`,  // synthetic email
        passwordHash,
        ownReferralCode,
        referralCode: data.referralCode || null,
        plan: 'FREE',
        role: 'USER',
      },
    });

    const token = await createToken({ userId: user.id, email: user.email, role: 'USER' as 'USER' | 'ADMIN' });
    await setSessionCookie(token);
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' };
  }
  redirect('/dashboard');
}
