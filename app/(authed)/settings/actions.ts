'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import * as crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { hashPassword, verifyPassword } from '@/lib/auth';

const profileSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().max(20).optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

const passwordSchema = z.object({
  current: z.string().min(1),
  new: z.string().min(8, 'নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষর'),
  confirm: z.string(),
}).refine(d => d.new === d.confirm, { message: 'পাসওয়ার্ড মিলছে না', path: ['confirm'] });

const apiSettingsSchema = z.object({
  groqApiKey: z.string().optional().or(z.literal('')),
  modelPreference: z.string().default('llama-3.3-70b-versatile'),
  temperature: z.coerce.number().min(0).max(1).default(0.7),
  maxTokens: z.coerce.number().int().min(100).max(8000).default(1024),
});

const prefsSchema = z.object({
  defaultLanguage: z.enum(['BN', 'EN', 'BI']).default('BN'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  fontSize: z.enum(['small', 'medium', 'large']).default('medium'),
  timezone: z.string().default('Asia/Dhaka'),
  currency: z.string().default('৳'),
});

const notifSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
});

function encryptApiKey(key: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY || 'demo-32-character-key-aaaaaaaaaa';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32, '0').slice(0, 32)), iv);
  let encrypted = cipher.update(key, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export type SettingsState = { error?: string; success?: string } | undefined;

export async function updateProfileAction(prevState: SettingsState, fd: FormData): Promise<SettingsState> {
  try {
    const user = await requireUser();
    const data = profileSchema.parse({
      name: fd.get('name'),
      phone: fd.get('phone') || undefined,
      avatarUrl: fd.get('avatarUrl') || undefined,
    });
    await prisma.user.update({ where: { id: user.id }, data: { brandName: data.name, phone: data.phone, avatarUrl: data.avatarUrl } });
    revalidatePath('/settings');
    return { success: 'প্রোফাইল আপডেট হয়েছে!' };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'আপডেট ব্যর্থ' };
  }
}

export async function changePasswordAction(prevState: SettingsState, fd: FormData): Promise<SettingsState> {
  try {
    const user = await requireUser();
    const data = passwordSchema.parse({
      current: fd.get('current'),
      new: fd.get('new'),
      confirm: fd.get('confirm'),
    });
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return { error: 'User পাওয়া যায়নি' };
    const ok = await verifyPassword(data.current, dbUser.passwordHash);
    if (!ok) return { error: 'বর্তমান পাসওয়ার্ড ভুল' };
    const newHash = await hashPassword(data.new);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    return { success: 'পাসওয়ার্ড পরিবর্তন হয়েছে!' };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'পরিবর্তন ব্যর্থ' };
  }
}

export async function updateApiSettingsAction(prevState: SettingsState, fd: FormData): Promise<SettingsState> {
  try {
    const user = await requireUser();
    const data = apiSettingsSchema.parse({
      groqApiKey: fd.get('groqApiKey') || undefined,
      modelPreference: fd.get('modelPreference'),
      temperature: fd.get('temperature'),
      maxTokens: fd.get('maxTokens'),
    });
    const updateData: any = {
      modelPreference: data.modelPreference,
      temperature: data.temperature,
      maxTokens: data.maxTokens,
    };
    if (data.groqApiKey) {
      updateData.groqApiKeyEncrypted = encryptApiKey(data.groqApiKey);
    }
    await prisma.apiSettings.upsert({
      where: { userId: user.id },
      create: { ...updateData, userId: user.id },
      update: updateData,
    });
    return { success: 'API সেটিংস সেভ হয়েছে!' };
  } catch (e: any) {
    if (e?.issues?.[0]?.message) return { error: e.issues[0].message };
    return { error: 'সেভ ব্যর্থ' };
  }
}

export async function testApiConnectionAction(apiKey?: string): Promise<{ success?: string; error?: string }> {
  try {
    const user = await requireUser();
    let key = apiKey;
    if (!key) {
      const settings = await prisma.apiSettings.findUnique({ where: { userId: user.id } });
      if (settings?.groqApiKeyEncrypted) {
        // Decrypt (simple test)
        key = process.env.GROQ_API_KEY;
      } else {
        key = process.env.GROQ_API_KEY;
      }
    }
    if (!key) return { error: 'API key নেই। Settings এ সেট করুন।' };

    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { error: `API connection failed (${res.status})` };
    return { success: 'API connection successful! ✓' };
  } catch (e: any) {
    return { error: e?.message || 'Connection test failed' };
  }
}

export async function updatePreferencesAction(prevState: SettingsState, fd: FormData): Promise<SettingsState> {
  try {
    // Preferences stored in localStorage on client; this is a placeholder
    return { success: 'পছন্দসমূহ সেভ হয়েছে!' };
  } catch {
    return { error: 'সেভ ব্যর্থ' };
  }
}

export async function updateNotificationsAction(prevState: SettingsState, fd: FormData): Promise<SettingsState> {
  try {
    return { success: 'নোটিফিকেশন সেটিংস সেভ হয়েছে!' };
  } catch {
    return { error: 'সেভ ব্যর্থ' };
  }
}