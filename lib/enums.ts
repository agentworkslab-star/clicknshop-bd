// Application-level enums (since SQLite doesn't support Prisma enums)
// Use these in TypeScript code instead of importing from @prisma/client

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const BrandTone = {
  PROFESSIONAL: 'PROFESSIONAL',
  FRIENDLY: 'FRIENDLY',
  FUNNY: 'FUNNY',
  FORMAL: 'FORMAL',
  CASUAL: 'CASUAL',
} as const;
export type BrandTone = (typeof BrandTone)[keyof typeof BrandTone];

export const StockStatus = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  LOW_STOCK: 'LOW_STOCK',
} as const;
export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export const Language = {
  BN: 'BN',
  EN: 'EN',
  BI: 'BI',
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export const TemplateType = {
  FACEBOOK_POST: 'FACEBOOK_POST',
  PRODUCT_DESCRIPTION: 'PRODUCT_DESCRIPTION',
  SEO_META: 'SEO_META',
  OFFER_POST: 'OFFER_POST',
  BANNER_TEXT: 'BANNER_TEXT',
  REEL_SCRIPT: 'REEL_SCRIPT',
  IMAGE_PROMPT: 'IMAGE_PROMPT',
} as const;
export type TemplateType = (typeof TemplateType)[keyof typeof TemplateType];

export const Length = {
  SHORT: 'SHORT',
  MEDIUM: 'MEDIUM',
  LONG: 'LONG',
} as const;
export type Length = (typeof Length)[keyof typeof Length];

// ============================================
// VALIDATION HELPERS
// ============================================
export function isValidUserRole(v: string): v is UserRole {
  return Object.values(UserRole).includes(v as UserRole);
}
export function isValidBrandTone(v: string): v is BrandTone {
  return Object.values(BrandTone).includes(v as BrandTone);
}
export function isValidStockStatus(v: string): v is StockStatus {
  return Object.values(StockStatus).includes(v as StockStatus);
}
export function isValidLanguage(v: string): v is Language {
  return Object.values(Language).includes(v as Language);
}
export function isValidTemplateType(v: string): v is TemplateType {
  return Object.values(TemplateType).includes(v as TemplateType);
}
export function isValidLength(v: string): v is Length {
  return Object.values(Length).includes(v as Length);
}