import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null | undefined, currency: string = '৳'): string {
  if (amount === null || amount === undefined) return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '';
  return `${currency}${num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function truncate(str: string, length: number = 100): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'এইমাত্র';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} দিন আগে`;
  return formatDate(d);
}

// Re-export JSON helpers from db-helpers (so client components can use them)
export { parseStringArray, stringifyStringArray, parseJson, stringifyJson } from './db-helpers';

export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  // Fallback
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve(true);
  } catch {
    document.body.removeChild(textArea);
    return Promise.resolve(false);
  }
}

export const TEMPLATE_LABELS: Record<string, { label: string; labelBn: string; icon: string }> = {
  FACEBOOK_POST: { label: 'Facebook Post', labelBn: 'ফেসবুক পোস্ট', icon: 'Facebook' },
  PRODUCT_DESCRIPTION: { label: 'Product Description', labelBn: 'প্রোডাক্ট বর্ণনা', icon: 'Package' },
  SEO_META: { label: 'SEO Title & Meta', labelBn: 'SEO টাইটেল ও মেটা', icon: 'Search' },
  OFFER_POST: { label: 'Offer / Promotion', labelBn: 'অফার / প্রমোশন', icon: 'Tag' },
  BANNER_TEXT: { label: 'Banner Text', labelBn: 'ব্যানার টেক্সট', icon: 'Image' },
  REEL_SCRIPT: { label: 'Reel Script', labelBn: 'রিল স্ক্রিপ্ট', icon: 'Video' },
  IMAGE_PROMPT: { label: 'Image Prompt', labelBn: 'ইমেজ প্রম্পট', icon: 'Sparkles' },
};