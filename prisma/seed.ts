// ClickNShop.bd Seed
// Creates: 1 admin + 1 demo user + 7 templates + sample brand memory
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { generateRandomString } from '../lib/utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ClickNShop.bd database...');

  // ===== USERS =====
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@clicknshop.bd';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@Bangla2026';
  const adminPhone = '01700000000';
  const adminHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { whatsappNumber: adminPhone },
    update: {},
    create: {
      brandName: 'ClickNShop.bd Admin',
      whatsappNumber: adminPhone,
      email: adminEmail,
      passwordHash: adminHash,
      role: 'ADMIN',
      plan: 'PRO',
      ownReferralCode: 'ADMIN001',
    },
  });
  console.log(`✓ Admin: ${adminEmail} / phone: ${adminPhone} / pw: ${adminPassword}`);

  const demoPhone = '01800000000';
  const demoHash = await bcrypt.hash('Demo@Bangla2026', 12);
  const demo = await prisma.user.upsert({
    where: { whatsappNumber: demoPhone },
    update: {},
    create: {
      brandName: 'FashionBD',
      whatsappNumber: demoPhone,
      email: 'demo@clicknshop.bd',
      passwordHash: demoHash,
      role: 'USER',
      plan: 'PRO',
      ownReferralCode: 'DEMO001',
      phone: '+880****0000',
    },
  });
  console.log(`✓ Demo:  phone: ${demoPhone} / pw: Demo@Bangla2026`);

  // ===== BRAND MEMORY for Demo =====
  await prisma.brandMemory.upsert({
    where: { userId: demo.id },
    update: {},
    create: {
      userId: demo.id,
      brandName: 'FashionBD',
      brandTone: 'FRIENDLY, conversational, trustworthy',
      audiencePain: 'Customers confused by too many fashion choices and fake product claims',
      winningCTA: 'Message us for personal styling help',
      productOffers: JSON.stringify(['20% off Eid collection', 'Free delivery in Dhaka', '7-day return policy']),
      audienceProfile: JSON.stringify({
        age: '18-35',
        gender: 'female',
        location: 'Dhaka, Chittagong',
        interests: ['fashion', 'beauty', 'lifestyle'],
      }),
      winningReferences: JSON.stringify([]),
      objections: JSON.stringify(['Too expensive', 'Size issues', 'Delivery delays']),
      website: 'https://fashionbd.example.com',
      phone: '+8801800000000',
      whatsapp: '+8801800000000',
      facebookPage: 'https://facebook.com/fashionbd',
      ctaDefault: 'অর্ডার করতে কল করুন: 01800-000000',
      primaryColor: '#0b3d0b',
      secondaryColor: '#22C55E',
      targetAudience: '১৮-৩৫ বছর বয়সী নারী, ঢাকা ও চট্টগ্রাম কেন্দ্রিক, fashion-conscious',
      description: 'FashionBD বাংলাদেশের প্রিমিয়াম ফ্যাশন ব্র্যান্ড। আমরা ট্রেন্ডি, কোয়ালিটি কাপড় সাশ্রয়ী দামে সরবরাহ করি।',
    },
  });
  console.log('✓ Demo brand memory');

  // ===== PRODUCTS for Demo (compatible with Product model) =====
  // Detect DB type: SQLite uses stringified JSON, PostgreSQL uses native arrays
  const isSqlite = (process.env.DATABASE_URL || '').startsWith('file:');
  const encodeArray = (arr: string[]) => isSqlite ? JSON.stringify(arr) : arr;

  const products = [
    {
      name: 'প্রিমিয়াম সিল্ক শাড়ি',
      category: 'Fashion',
      weight: '1.2 kg',
      shortDesc: 'বাংলাদেশি হাতের কাজ, প্রিমিয়াম কোয়ালিটি সিল্ক',
      longDesc: 'আমাদের প্রিমিয়াম সিল্ক শাড়ি ১০০% খাঁটি সিল্ক দিয়ে তৈরি। বাংলাদেশি কারিগরদের হাতের কাজ।',
      benefits: encodeArray(['১০০% খাঁটি সিল্ক', 'হাতের কাজের ডিজাইন', '৫ বছরের ওয়ারেন্টি', 'ফ্রি ডেলিভারি ঢাকায়']),
      price: 4500,
      discountPrice: 3800,
      seoKeywords: encodeArray(['silk saree', 'বাংলাদেশি শাড়ি', 'premium saree']),
      images: encodeArray(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600']),
      stockStatus: 'IN_STOCK' as const,
      sku: 'SAR-001',
    },
    {
      name: 'অর্গানিক হেয়ার অয়েল',
      category: 'Beauty',
      weight: '200ml',
      shortDesc: 'নারকেল, তিল, আমলা — ১০০% প্রাকৃতিক উপাদান',
      longDesc: 'আমাদের অর্গানিক হেয়ার অয়েল সম্পূর্ণ প্রাকৃতিক উপাদান দিয়ে তৈরি।',
      benefits: encodeArray(['১০০% অর্গানিক', 'কেমিক্যাল মুক্ত', 'চুল পড়া কমায়']),
      price: 650,
      discountPrice: 550,
      seoKeywords: encodeArray(['organic hair oil', 'natural hair care']),
      images: encodeArray(['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600']),
      stockStatus: 'IN_STOCK' as const,
      sku: 'BEA-002',
    },
    {
      name: 'স্মার্ট ওয়াচ প্রো',
      category: 'Electronics',
      weight: '50g',
      shortDesc: 'হার্ট রেট, SpO2, GPS, ৭ দিনের ব্যাটারি',
      longDesc: 'স্মার্ট ওয়াচ প্রো সমস্ত আধুনিক ফিচার সহ। AMOLED ডিসপ্লে, ওয়াটার রেজিস্ট্যান্ট।',
      benefits: encodeArray(['AMOLED Display', '৭ দিনের ব্যাটারি', 'GPS + SpO2', 'IP68']),
      price: 4500,
      discountPrice: 3999,
      seoKeywords: encodeArray(['smart watch', 'fitness watch']),
      images: encodeArray(['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600']),
      stockStatus: 'IN_STOCK' as const,
      sku: 'ELE-003',
    },
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { userId: demo.id, sku: p.sku } });
    if (!exists) {
      await prisma.product.create({
        data: {
          name: p.name,
          category: p.category,
          weight: p.weight,
          shortDesc: p.shortDesc,
          longDesc: p.longDesc,
          benefits: p.benefits as any,  // already encoded by encodeArray()
          price: p.price,
          discountPrice: p.discountPrice,
          seoKeywords: p.seoKeywords as any,
          images: p.images as any,
          stockStatus: p.stockStatus as any,
          sku: p.sku,
          userId: demo.id,
        },
      });
    }
  }
  console.log(`✓ ${products.length} demo products`);

  // ===== FRAMEWORKS (presets per Document 3) =====
  const frameworks = [
    {
      name: 'PAS Framework',
      type: 'PAS',
      description: 'Problem → Agitation → Solution — classic direct response copywriting',
      content: `# PAS Framework
- Problem: Highlight the pain your audience faces
- Agitation: Twist the knife — describe consequences of ignoring it
- Solution: Present the product as the calm, proven answer`,
      isPreset: true,
      icon: 'Zap',
    },
    {
      name: 'AIDA Framework',
      type: 'AIDA',
      description: 'Attention → Interest → Desire → Action',
      content: `# AIDA Framework
- Attention: Bold hook that stops scroll
- Interest: Build curiosity with a twist
- Desire: Show life after using the product
- Action: Clear, single CTA`,
      isPreset: true,
      icon: 'Target',
    },
    {
      name: 'Hormozi Framework',
      type: 'HORMOZI',
      description: 'Value equation + bold claim + proof',
      content: `# Hormozi Framework
- Value Equation: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)
- Proof: Show social proof, testimonials, before-after
- Bold Claim + Justification`,
      isPreset: true,
      icon: 'TrendingUp',
    },
    {
      name: 'Storytelling',
      type: 'STORYTELLING',
      description: 'Hero → Struggle → Guide → Plan → Success',
      content: `# Storytelling Framework
- Hero: The audience (relatable character)
- Struggle: Their pain and challenge
- Guide: The brand (mentor)
- Plan: The actionable steps
- Success: The transformation`,
      isPreset: true,
      icon: 'BookOpen',
    },
  ];

  for (const f of frameworks) {
    const data = {
      name: f.name,
      type: f.type as any,  // FrameworkType enum
      description: f.description,
      content: f.content,
      isPreset: f.isPreset,
      icon: f.icon,
    };
    try {
      await prisma.framework.upsert({
        where: { id: `preset-${f.type}` },
        update: data,
        create: { ...data, id: `preset-${f.type}`, userId: demo.id },
      });
    } catch {
      await prisma.framework.create({ data: { ...data, userId: demo.id } });
    }
  }
  console.log(`✓ ${frameworks.length} preset frameworks`);

  // ===== TEMPLATES (for AI Writer) =====
  const templates = [
    {
      slug: 'FACEBOOK_POST',
      name: 'Facebook Post',
      description: 'Engaging Facebook post with hook, benefits, CTA, hashtags',
      icon: 'Facebook',
      systemPrompt: 'You are an expert Bangladeshi social media copywriter. Generate an engaging Facebook post based on the provided brand and product data.\n\nRules:\n- Length: 80-150 words\n- Language: Match requested (Bangla/English/Bilingual)\n- Structure: Hook, Product highlight, CTA, hashtags\n- Use emojis naturally\n- Include brand default CTA\n\nOutput only the post text.',
      inputSchema: JSON.stringify({ productId: 'string?', language: 'enum', tone: 'enum', length: 'enum' }),
    },
    {
      slug: 'PRODUCT_DESCRIPTION',
      name: 'Product Description',
      description: 'E-commerce product description with bullet points',
      icon: 'Package',
      systemPrompt: 'You are a professional e-commerce product copywriter for Bangladesh market. Write a compelling product description with structure: opening line, overview, key features (4-6 bullets), specs, why choose, CTA. Include SEO keywords naturally. Format: markdown-compatible. Output only the description.',
      inputSchema: JSON.stringify({ productId: 'string?', language: 'enum', length: 'enum' }),
    },
    {
      slug: 'SEO_META',
      name: 'SEO Title & Meta',
      description: 'SEO-optimized title tags and meta descriptions',
      icon: 'Search',
      systemPrompt: 'You are an SEO expert. Generate SEO Title (max 60 chars), Meta Description (max 155 chars), alternative titles, focus keyword, secondary keywords. Include primary keyword in title near beginning. Title should have emotional trigger or number.',
      inputSchema: JSON.stringify({ productId: 'string?', language: 'enum' }),
    },
    {
      slug: 'OFFER_POST',
      name: 'Offer / Promotion',
      description: 'High-converting offer post with urgency',
      icon: 'Tag',
      systemPrompt: 'You are a promotional copywriter. Create offer post with: bold headline with discount, original vs discounted price, validity, benefits, how to order, CTA. Use emojis (🔥⚡🎁), urgency language. Length 120-200 words.',
      inputSchema: JSON.stringify({ productId: 'string?', language: 'enum' }),
    },
    {
      slug: 'BANNER_TEXT',
      name: 'Banner Text',
      description: 'Short, punchy text for banners/ads',
      icon: 'Image',
      systemPrompt: 'You are a graphic design copywriter. Generate SHORT banner text: Main Headline (3-6 words), Sub-headline (5-10 words), Offer Line, CTA Button (2-4 words), Contact. Use power words. Visual-friendly.',
      inputSchema: JSON.stringify({ productId: 'string?' }),
    },
    {
      slug: 'REEL_SCRIPT',
      name: 'Reel Script',
      description: '30-60 second viral short video script',
      icon: 'Video',
      systemPrompt: 'You are a viral short-video scriptwriter. Create 30-60 sec script with 5 sections: HOOK (3s), PROBLEM (3-8s), SOLUTION (8-25s), BENEFITS (25-45s), CTA (45-60s). Include Visual, Voiceover/Text for each. Suggested music + hashtags.',
      inputSchema: JSON.stringify({ productId: 'string?', language: 'enum' }),
    },
    {
      slug: 'IMAGE_PROMPT',
      name: 'Image Prompt',
      description: 'Detailed image prompts for Midjourney/DALL-E/Leonardo',
      icon: 'Sparkles',
      systemPrompt: 'You are a world-class AI image prompt engineer. Generate EXTREMELY DETAILED prompt (60-120 words English): Subject, Composition, Background, Lighting, Style, Mood, Colors, Camera, Quality boosters. Include negative prompt + platform-specific (Midjourney, DALL-E, Leonardo, SDXL) + Bangla explanation + 3-5 tips.',
      inputSchema: JSON.stringify({ productId: 'string?', imagePurpose: 'string', imageStyle: 'string', imageMood: 'string', imageAspect: 'string', imageElements: 'string?' }),
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, icon: t.icon, systemPrompt: t.systemPrompt, inputSchema: t.inputSchema, isActive: true },
      create: t,
    });
  }
  console.log(`✓ ${templates.length} AI templates`);

  console.log('\n✅ Seed complete!');
  console.log('\n📝 Login credentials (for testing only):');
  console.log(`   Admin:  phone=${adminPhone}  pw=${adminPassword}`);
  console.log(`   Demo:   phone=${demoPhone}  pw=Demo@Bangla2026`);
  console.log('\n🔓 Bypass Mode is ENABLED — direct dashboard access without login');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
