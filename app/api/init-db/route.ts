// Production database initialization API
// Auto-runs on first dashboard access to create tables + seed data
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('🌱 Initializing production database...');

    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');

    // Check if already initialized
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      console.log(`✅ Database already initialized (${userCount} users)`);
      await prisma.$disconnect();
      return NextResponse.json({
        success: true,
        message: 'Database already initialized',
        users: userCount,
      });
    }

    console.log('📝 Seeding data...');

    const dummyHash = '$2a$12$placeholder.hash.will.be.replaced';

    // Admin user
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

    // Demo user
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
        description: 'FashionBD is a premium Bangladeshi fashion brand.',
      },
    });

    // Products (3 demo products)
    const products = [
      {
        name: 'প্রিমিয়াম সিল্ক শাড়ি',
        category: 'Fashion',
        weight: '1.2 kg',
        shortDesc: 'বাংলাদেশি হাতের কাজ, প্রিমিয়াম কোয়ালিটি সিল্ক',
        longDesc: 'আমাদের প্রিমিয়াম সিল্ক শাড়ি ১০০% খাঁটি সিল্ক দিয়ে তৈরি।',
        benefits: ['১০০% খাঁটি সিল্ক', 'হাতের কাজের ডিজাইন', '৫ বছরের ওয়ারেন্টি', 'ফ্রি ডেলিভারি ঢাকায়'],
        price: 4500,
        discountPrice: 3800,
        seoKeywords: ['silk saree', 'বাংলাদেশি শাড়ি', 'premium saree'],
        images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'],
        stockStatus: 'IN_STOCK' as const,
        sku: 'SAR-001',
      },
      {
        name: 'অর্গানিক হেয়ার অয়েল',
        category: 'Beauty',
        weight: '200ml',
        shortDesc: 'নারকেল, তিল, আমলা — ১০০% প্রাকৃতিক উপাদান',
        longDesc: 'আমাদের অর্গানিক হেয়ার অয়েল সম্পূর্ণ প্রাকৃতিক উপাদান দিয়ে তৈরি।',
        benefits: ['১০০% অর্গানিক', 'কেমিক্যাল মুক্ত', 'চুল পড়া কমায়'],
        price: 650,
        discountPrice: 550,
        seoKeywords: ['organic hair oil', 'natural hair care'],
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'],
        stockStatus: 'IN_STOCK' as const,
        sku: 'BEA-002',
      },
      {
        name: 'স্মার্ট ওয়াচ প্রো',
        category: 'Electronics',
        weight: '50g',
        shortDesc: 'হার্ট রেট, SpO2, GPS, ৭ দিনের ব্যাটারি',
        longDesc: 'স্মার্ট ওয়াচ প্রো সমস্ত আধুনিক ফিচার সহ।',
        benefits: ['AMOLED Display', '৭ দিনের ব্যাটারি', 'GPS + SpO2', 'IP68'],
        price: 4500,
        discountPrice: 3999,
        seoKeywords: ['smart watch', 'fitness watch'],
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'],
        stockStatus: 'IN_STOCK' as const,
        sku: 'ELE-003',
      },
    ];

    for (const p of products) {
      const exists = await prisma.product.findFirst({
        where: { userId: demo.id, sku: p.sku },
      });
      if (!exists) {
        await prisma.product.create({
          data: {
            userId: demo.id,
            name: p.name,
            category: p.category,
            weight: p.weight,
            shortDesc: p.shortDesc,
            longDesc: p.longDesc,
            benefits: p.benefits,
            price: p.price,
            discountPrice: p.discountPrice,
            seoKeywords: p.seoKeywords,
            images: p.images,
            stockStatus: p.stockStatus,
            sku: p.sku,
          },
        });
      }
    }

    // Frameworks (4 preset)
    const frameworks = [
      {
        name: 'PAS Framework',
        type: 'PAS' as const,
        description: 'Problem → Agitation → Solution',
        content: '# PAS Framework\n- Problem: Highlight the pain your audience faces\n- Agitation: Twist the knife\n- Solution: Present the product as the answer',
        icon: 'Zap',
        isPreset: true,
      },
      {
        name: 'AIDA Framework',
        type: 'AIDA' as const,
        description: 'Attention → Interest → Desire → Action',
        content: '# AIDA Framework\n- Attention: Bold hook\n- Interest: Build curiosity\n- Desire: Show life after\n- Action: Clear CTA',
        icon: 'Target',
        isPreset: true,
      },
      {
        name: 'Hormozi Framework',
        type: 'HORMOZI' as const,
        description: 'Value equation + proof',
        content: '# Hormozi\n- Value Equation\n- Proof: Social proof, testimonials\n- Bold Claim + Justification',
        icon: 'TrendingUp',
        isPreset: true,
      },
      {
        name: 'Storytelling',
        type: 'STORYTELLING' as const,
        description: 'Hero → Struggle → Guide → Plan → Success',
        content: '# Storytelling\n- Hero: The audience\n- Struggle: Their pain\n- Guide: The brand\n- Plan: Actionable steps\n- Success: Transformation',
        icon: 'BookOpen',
        isPreset: true,
      },
    ];

    for (const f of frameworks) {
      const exists = await prisma.framework.findFirst({
        where: { userId: demo.id, name: f.name },
      });
      if (!exists) {
        await prisma.framework.create({
          data: {
            userId: demo.id,
            name: f.name,
            type: f.type,
            description: f.description,
            content: f.content,
            icon: f.icon,
            isPreset: f.isPreset,
          },
        });
      }
    }

    // Templates (7 AI templates)
    const templates = [
      {
        slug: 'FACEBOOK_POST',
        name: 'Facebook Post',
        description: 'Engaging Facebook post with hook, benefits, CTA, hashtags',
        icon: 'Facebook',
        systemPrompt: 'You are an expert Bangladeshi social media copywriter. Generate an engaging Facebook post in Bangla based on the provided brand and product data. Output only the post text.',
        inputSchema: { fields: ['productId', 'language', 'tone', 'length'] },
        isActive: true,
      },
      {
        slug: 'PRODUCT_DESCRIPTION',
        name: 'Product Description',
        description: 'E-commerce product description with bullet points',
        icon: 'Package',
        systemPrompt: 'You are a professional e-commerce product copywriter. Write a compelling product description in Bangla with key features and benefits.',
        inputSchema: { fields: ['productId', 'language', 'length'] },
        isActive: true,
      },
      {
        slug: 'SEO_META',
        name: 'SEO Title & Meta',
        description: 'SEO-optimized title tags and meta descriptions',
        icon: 'Search',
        systemPrompt: 'You are an SEO expert. Generate SEO Title, Meta Description, and keywords optimized for search engines.',
        inputSchema: { fields: ['productId', 'language'] },
        isActive: true,
      },
      {
        slug: 'OFFER_POST',
        name: 'Offer / Promotion',
        description: 'High-converting offer post with urgency',
        icon: 'Tag',
        systemPrompt: 'You are a promotional copywriter. Create offer post with bold headline, price, validity, and clear CTA in Bangla.',
        inputSchema: { fields: ['productId', 'language'] },
        isActive: true,
      },
      {
        slug: 'BANNER_TEXT',
        name: 'Banner Text',
        description: 'Short, punchy text for banners/ads',
        icon: 'Image',
        systemPrompt: 'You are a graphic design copywriter. Generate SHORT banner text (max 10 words) in Bangla.',
        inputSchema: { fields: ['productId'] },
        isActive: true,
      },
      {
        slug: 'REEL_SCRIPT',
        name: 'Reel Script',
        description: '30-60 second viral short video script',
        icon: 'Video',
        systemPrompt: 'You are a viral short-video scriptwriter. Create 30-60 sec script with HOOK, PROBLEM, SOLUTION, BENEFITS, CTA in Bangla.',
        inputSchema: { fields: ['productId', 'language'] },
        isActive: true,
      },
      {
        slug: 'IMAGE_PROMPT',
        name: 'Image Prompt',
        description: 'Detailed image prompts for Midjourney/DALL-E/Leonardo',
        icon: 'Sparkles',
        systemPrompt: 'You are a world-class AI image prompt engineer. Generate EXTREMELY DETAILED prompt for AI image generators.',
        inputSchema: { fields: ['productId', 'imagePurpose', 'imageStyle', 'imageMood', 'imageAspect', 'imageElements'] },
        isActive: true,
      },
    ];

    for (const t of templates) {
      await prisma.template.upsert({
        where: { slug: t.slug },
        update: {
          name: t.name,
          description: t.description,
          icon: t.icon,
          systemPrompt: t.systemPrompt,
          inputSchema: t.inputSchema,
          isActive: t.isActive,
        },
        create: t,
      });
    }

    await prisma.$disconnect();
    console.log('✅ Seed complete: 2 users, 3 products, 4 frameworks, 7 templates');

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully!',
      counts: {
        users: 2,
        products: 3,
        frameworks: 4,
        templates: 7,
      },
    });
  } catch (e: any) {
    console.error('❌ Init failed:', e);
    await prisma.$disconnect();
    return NextResponse.json(
      {
        success: false,
        error: e.message,
        hint: 'Tables may not exist - need prisma db push first',
      },
      { status: 500 }
    );
  }
}
