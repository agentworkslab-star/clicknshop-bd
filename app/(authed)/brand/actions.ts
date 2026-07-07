'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { BrandTone } from '@/lib/enums';
import { stringifyStringArray } from '@/lib/db-helpers';

const brandSchema = z.object({
  brandName: z.string().min(1, 'Brand নাম দিতে হবে').max(100),
  website: z.string().url('সঠিক URL দিন').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  facebookPage: z.string().url().optional().or(z.literal('')),
  whatsapp: z.string().max(20).optional().or(z.literal('')),
  ctaDefault: z.string().max(200).optional().or(z.literal('')),
  tone: z.nativeEnum(BrandTone),
  logoUrl: z.string().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'সঠিক hex color দিন').default('#6366F1'),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#8B5CF6'),
  targetAudience: z.string().max(500).optional().or(z.literal('')),
  description: z.string().max(1000).optional().or(z.literal('')),
});

export type BrandState = { error?: string; success?: string; data?: any } | undefined;

export async function saveBrandAction(prevState: BrandState, formData: FormData): Promise<BrandState> {
  try {
    const user = await requireUser();
    const data = brandSchema.parse({
      brandName: formData.get('brandName'),
      website: formData.get('website') || undefined,
      phone: formData.get('phone') || undefined,
      facebookPage: formData.get('facebookPage') || undefined,
      whatsapp: formData.get('whatsapp') || undefined,
      ctaDefault: formData.get('ctaDefault') || undefined,
      tone: formData.get('tone'),
      logoUrl: formData.get('logoUrl') || undefined,
      primaryColor: formData.get('primaryColor'),
      secondaryColor: formData.get('secondaryColor'),
      targetAudience: formData.get('targetAudience') || undefined,
      description: formData.get('description') || undefined,
    });

    const brand = await prisma.brandMemory.upsert({
      where: { userId: user.id },
      create: { ...data, userId: user.id },
      update: data,
    });

    revalidatePath('/brand');
    revalidatePath('/dashboard');
    return { success: 'Brand Memory সফলভাবে সেভ হয়েছে!', data: brand };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    if (e?.message === 'UNAUTHORIZED') return { error: 'Login প্রয়োজন' };
    console.error('Brand save error:', e);
    return { error: 'সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' };
  }
}

export async function getBrandAction() {
  try {
    const user = await requireUser();
    return await prisma.brandMemory.findUnique({ where: { userId: user.id } });
  } catch {
    return null;
  }
}