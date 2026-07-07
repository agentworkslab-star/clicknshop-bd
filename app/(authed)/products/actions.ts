'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { StockStatus } from '@/lib/enums';
import { stringifyStringArray } from '@/lib/db-helpers';

const productSchema = z.object({
  name: z.string().min(1, 'নাম দিতে হবে').max(200),
  category: z.string().max(50).optional().or(z.literal('')),
  weight: z.string().max(50).optional().or(z.literal('')),
  shortDesc: z.string().max(500).optional().or(z.literal('')),
  longDesc: z.string().max(5000).optional().or(z.literal('')),
  benefits: z.array(z.string()).default([]),
  price: z.coerce.number().nonnegative('সঠিক মূল্য দিন').optional(),
  discountPrice: z.coerce.number().nonnegative().optional(),
  seoKeywords: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  stockStatus: z.nativeEnum(StockStatus).default('IN_STOCK'),
  sku: z.string().max(50).optional().or(z.literal('')),
});

export type ProductState = { error?: string; success?: string; id?: string } | undefined;

export async function createProductAction(prevState: ProductState, formData: FormData): Promise<ProductState> {
  try {
    const user = await requireUser();
    const benefits = formData.getAll('benefits').filter(b => b) as string[];
    const seoKeywords = formData.getAll('seoKeywords').filter(k => k) as string[];
    const images = formData.getAll('images').filter(i => i) as string[];

    const data = productSchema.parse({
      name: formData.get('name'),
      category: formData.get('category') || undefined,
      weight: formData.get('weight') || undefined,
      shortDesc: formData.get('shortDesc') || undefined,
      longDesc: formData.get('longDesc') || undefined,
      benefits, seoKeywords, images,
      price: formData.get('price') || undefined,
      discountPrice: formData.get('discountPrice') || undefined,
      stockStatus: formData.get('stockStatus') || 'IN_STOCK',
      sku: formData.get('sku') || undefined,
    });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        weight: data.weight,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        benefits: stringifyStringArray(data.benefits),
        price: data.price,
        discountPrice: data.discountPrice,
        seoKeywords: stringifyStringArray(data.seoKeywords),
        images: stringifyStringArray(data.images),
        stockStatus: (data.stockStatus as any) || 'IN_STOCK',
        sku: data.sku,
        userId: user.id,
      },
    });

    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: 'প্রোডাক্ট তৈরি হয়েছে!', id: product.id };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'প্রোডাক্ট তৈরি করতে সমস্যা হয়েছে।' };
  }
}

export async function updateProductAction(id: string, prevState: ProductState, formData: FormData): Promise<ProductState> {
  try {
    const user = await requireUser();
    const benefits = formData.getAll('benefits').filter(b => b) as string[];
    const seoKeywords = formData.getAll('seoKeywords').filter(k => k) as string[];
    const images = formData.getAll('images').filter(i => i) as string[];

    const data = productSchema.parse({
      name: formData.get('name'),
      category: formData.get('category') || undefined,
      weight: formData.get('weight') || undefined,
      shortDesc: formData.get('shortDesc') || undefined,
      longDesc: formData.get('longDesc') || undefined,
      benefits, seoKeywords, images,
      price: formData.get('price') || undefined,
      discountPrice: formData.get('discountPrice') || undefined,
      stockStatus: formData.get('stockStatus') || 'IN_STOCK',
      sku: formData.get('sku') || undefined,
    });

    await prisma.product.update({
      where: { id, userId: user.id },
      data: {
        name: data.name,
        category: data.category,
        weight: data.weight,
        shortDesc: data.shortDesc,
        longDesc: data.longDesc,
        benefits: stringifyStringArray(data.benefits),
        price: data.price,
        discountPrice: data.discountPrice,
        seoKeywords: stringifyStringArray(data.seoKeywords),
        images: stringifyStringArray(data.images),
        stockStatus: (data.stockStatus as any) || 'IN_STOCK',
        sku: data.sku,
      },
    });

    revalidatePath('/products');
    revalidatePath(`/products/${id}`);
    return { success: 'প্রোডাক্ট আপডেট হয়েছে!' };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'আপডেট করতে সমস্যা হয়েছে।' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const user = await requireUser();
    await prisma.product.delete({ where: { id, userId: user.id } });
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'ডিলিট করতে সমস্যা হয়েছে।' };
  }
}

export async function duplicateProductAction(id: string) {
  try {
    const user = await requireUser();
    const product = await prisma.product.findUnique({ where: { id, userId: user.id } });
    if (!product) return { error: 'প্রোডাক্ট পাওয়া যায়নি' };
    const { id: pid, createdAt: ca, updatedAt: ua, benefits, seoKeywords, images, ...rest } = product;
    await prisma.product.create({
      data: {
        ...rest,
        name: `${product.name} (Copy)`,
        userId: user.id,
        benefits,
        seoKeywords,
        images,
      },
    });
    revalidatePath('/products');
    return { success: 'প্রোডাক্ট কপি হয়েছে!' };
  } catch {
    return { error: 'কপি করতে সমস্যা হয়েছে।' };
  }
}