// One-time production DB initialization
// Creates tables and seeds demo data using Vercel's network (which CAN reach Supabase/Neon)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Force dynamic to prevent build-time execution
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prisma = new PrismaClient();

    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ DB connection OK');

    // Check if users table has data
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already initialized (${userCount} users)`,
        users: userCount,
      });
    }

    // Create admin
    const dummyHash = '$2a$12$placeholder.hash.will.be.replaced';
    const admin = await prisma.user.upsert({
      where: { whatsappNumber: '01700000000' },
      update: {},
      create: {
        brandName: 'ClickNShop Admin',
        whatsappNumber: '01700000000',
        email: 'admin@clicknshop.bd',
        passwordHash: dummyHash,
        phone: '+880****0000',
        ownReferralCode: 'ADMIN001',
        role: 'ADMIN',
        plan: 'PRO',
        emailVerified: true,
      },
    });

    // Create demo
    const demo = await prisma.user.upsert({
      where: { whatsappNumber: '01800000000' },
      update: {},
      create: {
        brandName: 'FashionBD',
        whatsappNumber: '01800000000',
        email: 'demo@clicknshop.bd',
        passwordHash: dummyHash,
        phone: '+880****0000',
        ownReferralCode: 'DEMO001',
        role: 'USER',
        plan: 'PRO',
        emailVerified: true,
      },
    });

    // Brand memory
    await prisma.brandMemory.upsert({
      where: { userId: demo.id },
      update: {},
      create: {
        userId: demo.id,
        brandName: 'FashionBD',
        brandTone: 'Friendly, conversational',
        audiencePain: 'Too many fashion choices',
        winningCTA: 'Message us',
        productOffers: ['20% off', 'Free delivery'],
        audienceProfile: { age: '18-35', gender: 'female' },
        winningReferences: [],
        objections: ['Too expensive'],
        primaryColor: '#0b3d0b',
        secondaryColor: '#22C55E',
        targetAudience: 'Fashion-conscious women',
        description: 'FashionBD brand',
      },
    });

    // Products
    const products = [
      { name: 'প্রিমিয়াম সিল্ক শাড়ি', category: 'Fashion', sku: 'SAR-001', price: 4500, discountPrice: 3800, benefits: ['১০০% খাঁটি সিল্ক', 'হাতের কাজ'], seoKeywords: ['silk saree'], images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'], stockStatus: 'IN_STOCK' as const },
      { name: 'অর্গানিক হেয়ার অয়েল', category: 'Beauty', sku: 'BEA-002', price: 650, discountPrice: 550, benefits: ['১০০% অর্গানিক'], seoKeywords: ['organic'], images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], stockStatus: 'IN_STOCK' as const },
      { name: 'স্মার্ট ওয়াচ প্রো', category: 'Electronics', sku: 'ELE-003', price: 4500, discountPrice: 3999, benefits: ['AMOLED'], seoKeywords: ['smart watch'], images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'], stockStatus: 'IN_STOCK' as const },
    ];
    for (const p of products) {
      const exists = await prisma.product.findFirst({ where: { userId: demo.id, sku: p.sku } });
      if (!exists) {
        await prisma.product.create({ data: { ...p, userId: demo.id } });
      }
    }

    // Frameworks + Templates (lite version)
    const frameworks = [
      { name: 'PAS Framework', type: 'PAS' as any, description: 'Problem → Agitation → Solution', content: '# PAS Framework', icon: 'Zap', isPreset: true },
      { name: 'AIDA Framework', type: 'AIDA' as any, description: 'Attention → Interest → Desire → Action', content: '# AIDA', icon: 'Target', isPreset: true },
      { name: 'Hormozi', type: 'HORMOZI' as any, description: 'Value equation', content: '# Hormozi', icon: 'TrendingUp', isPreset: true },
      { name: 'Storytelling', type: 'STORYTELLING' as any, description: 'Hero → Success', content: '# Storytelling', icon: 'BookOpen', isPreset: true },
    ];
    for (const f of frameworks) {
      const exists = await prisma.framework.findFirst({ where: { userId: demo.id, name: f.name } });
      if (!exists) await prisma.framework.create({ data: { ...f, userId: demo.id } });
    }

    // Templates
    const templates = [
      { slug: 'FACEBOOK_POST', name: 'Facebook Post', description: 'Engaging post', icon: 'Facebook', systemPrompt: 'You are a Bangladeshi social media copywriter.' },
      { slug: 'PRODUCT_DESCRIPTION', name: 'Product Description', description: 'E-commerce', icon: 'Package', systemPrompt: 'You are a product copywriter.' },
      { slug: 'SEO_META', name: 'SEO Title & Meta', description: 'SEO', icon: 'Search', systemPrompt: 'You are an SEO expert.' },
      { slug: 'OFFER_POST', name: 'Offer', description: 'Promo', icon: 'Tag', systemPrompt: 'Promotional copywriter.' },
      { slug: 'BANNER_TEXT', name: 'Banner', description: 'Banner', icon: 'Image', systemPrompt: 'Design copywriter.' },
      { slug: 'REEL_SCRIPT', name: 'Reel Script', description: 'Video', icon: 'Video', systemPrompt: 'Video scriptwriter.' },
      { slug: 'IMAGE_PROMPT', name: 'Image Prompt', description: 'Image prompts', icon: 'Sparkles', systemPrompt: 'Image prompt engineer.' },
    ];
    for (const t of templates) {
      await prisma.template.upsert({
        where: { slug: t.slug },
        update: { name: t.name, description: t.description, icon: t.icon, systemPrompt: t.systemPrompt, isActive: true },
        create: t,
      });
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      counts: {
        users: await new PrismaClient().user.count().then(c => { (new PrismaClient()).$disconnect(); return c; }),
        products: 3,
        frameworks: 4,
        templates: 7,
      },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      hint: 'Tables may not exist - need prisma db push first',
    }, { status: 500 });
  }
}
