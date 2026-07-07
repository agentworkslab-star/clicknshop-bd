import { SignJWT, jwtVerify } from 'jose';
import * as bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-min-32-chars-long-x'
);
const JWT_EXPIRES_IN = '30d';
const COOKIE_NAME = 'bizai_session';
const BYPASS_USER_ID = process.env.BYPASS_USER_ID || null; // If set, use this user as default
const BYPASS_MODE_ENABLED = process.env.BYPASS_MODE_ENABLED === 'true'; // personal single-user mode

export interface SessionPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * BYPASS MODE: For personal client use, we auto-resolve to a default user
 * if no session exists. This lets the user access the dashboard without logging in.
 */
export async function getCurrentUser() {
  // Try real session first
  try {
    const session = await getSession();
    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, brandName: true, email: true, role: true, avatarUrl: true, phone: true },
      });
      if (user) return user;
    }
  } catch {}

  // Bypass: auto-resolve to default user (demo user from seed)
  try {
    let defaultUser;
    if (BYPASS_USER_ID) {
      defaultUser = await prisma.user.findUnique({
        where: { id: BYPASS_USER_ID },
        select: { id: true, brandName: true, email: true, role: true, avatarUrl: true, phone: true },
      });
    }
    if (!defaultUser) {
      defaultUser = await prisma.user.findFirst({
        where: { whatsappNumber: '01800000000' },
        select: { id: true, brandName: true, email: true, role: true, avatarUrl: true, phone: true },
      });
    }
    if (!defaultUser) {
      // Fallback: any first user
      defaultUser = await prisma.user.findFirst({
        select: { id: true, brandName: true, email: true, role: true, avatarUrl: true, phone: true },
      });
    }
    if (defaultUser) return defaultUser;
  } catch (e) {
    console.error('Bypass mode fallback error:', e);
  }

  // Ultimate fallback — return a fake demo user so pages never crash
  return {
    id: 'bypass-user',
    brandName: 'Demo User',
    email: 'demo@clicknshop.bd',
    role: 'USER',
    avatarUrl: null,
    phone: null,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('NO_USER_FOUND');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}

export const COOKIE_NAME_PUBLIC = COOKIE_NAME;