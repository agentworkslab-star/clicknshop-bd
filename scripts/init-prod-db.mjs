// Production database initialization script
// Runs during Vercel build to create tables and seed data
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Initializing production database...');

  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');
  } catch (e: any) {
    console.log('⚠️ Database not reachable, skipping init:', e.message);
    process.exit(0); // Don't fail build
  }

  // Check if already initialized
  let userCount = 0;
  try {
    userCount = await prisma.user.count();
  } catch (e: any) {
    console.log('⚠️ Tables may not exist, will skip init if schema push failed');
    process.exit(0);
  }

  if (userCount > 0) {
    console.log(`✅ Database already initialized (${userCount} users)`);
    process.exit(0);
  }

  console.log('📝 Seeding data...');

  const dummyHash = '$2a$12$placeholder.hash.will.be.replaced';

  // Admin
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

  // Demo User
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

  // Brand Memory
  await prisma.brandMemory.upsert({
    where: { userId: demo.id },
    update: {},
    create: {
      userId: demo.id,
      brandName: 'FashionBD',
      brandTone: 'Friendly, conversational, trustworthy',
      audiencePain: 'Customers confused by too many fashion choices',
      winningCTA: 'Message us for personal styling help',
      productOffers: ['20% off Eid collection', 'Free delivery in Dhaka'],
      audienceProfile: { age: '18-35', gender: 'female', location: 'Dhaka' },
      winningReferences: [],
      objections: ['Too expensive', 'Size issues', 'Delivery delays'],
      primaryColor: '#0b3d0b',
      secondaryColor: '#22C55E',
      targetAudience: '18-35 year old women, Dhaka, fashion-conscious',
      description: 'FashionBD is Bangladeshs premium fashion brand.',
    },
  });

  // Products
  const products = [
    { name: 'প্রিমিয়াম সিল্ক শাড়ি', category: 'Fashion', weight: '1.2 kg', shortDesc: 'বাংলাদেশি হাতের কাজ, প্রিমিয়াম কোয়ালিটি সিল্ক', longDesc: '১০০% খাঁটি সিল্ক দিয়ে তৈরি।', benefits: ['১০০% খাঁটি সিল্ক', 'হাতের কাজের ডিজাইন', '৫ বছরের ওয়ারেন্টি', 'ফ্রি ডেলিভারি ঢাকায়'], price: 4500, discountPrice: 3800, seoKeywords: ['silk saree', 'বাংলাদেশি শাড়ি'], images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'], stockStatus: 'IN_STOCK', sku: 'SAR-001' },
    { name: 'অর্গানিক হেয়ার অয়েল', category: 'Beauty', weight: '200ml', shortDesc: 'নারকেল, তিল, আমলা — ১০০% প্রাকৃতিক', longDesc: 'সম্পূর্ণ প্রাকৃতিক উপাদান।', benefits: ['১০০% অর্গানিক', 'কেমিক্যাল মুক্ত', 'চুল পড়া কমায়'], price: 650, discountPrice: 550, seoKeywords: ['organic hair oil'], images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], stockStatus: 'IN_STOCK', sku: 'BEA-002' },
    { name: 'স্মার্ট ওয়াচ প্রো', category: 'Electronics', weight: '50g', shortDesc: 'হার্ট রেট, SpO2, GPS, ৭ দিনের ব্যাটারি', longDesc: 'সমস্ত আধুনিক ফিচার সহ।', benefits: ['AMOLED Display', '৭ দিনের ব্যাটারি', 'GPS + SpO2', 'IP68'], price: 4500, discountPrice: 3999, seoKeywords: ['smart watch'], images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'], stockStatus: 'IN_STOCK', sku: 'ELE-003' },
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { userId: demo.id, sku: p.sku } });
    if (!exists) {
      await prisma.product.create({ data: { ...p, userId: demo.id } });
    }
  }

  // Frameworks
  const frameworks = [
    { name: 'PAS Framework', type: 'PAS', description: 'Problem → Agitation → Solution', content: '# PAS Framework', icon: 'Zap' },
    { name: 'AIDA Framework', type: 'AIDA', description: 'Attention → Interest → Desire → Action', content: '# AIDA Framework', icon: 'Target' },
    { name: 'Hormozi Framework', type: 'HORMOZI', description: 'Value equation + proof', content: '# Hormozi', icon: 'TrendingUp' },
    { name: 'Storytelling', type: 'STORYTELLING', description: 'Hero → Guide → Success', content: '# Storytelling', icon: 'BookOpen' },
  ];
  for (const f of frameworks) {
    const exists = await prisma.framework.findFirst({ where: { userId: demo.id, name: f.name } });
    if (!exists) {
      await prisma.framework.create({ data: { ...f, userId: demo.id, isPreset: true } });
    }
  }

  // Templates
  const templates = [
    { slug: 'FACEBOOK_POST', name: 'Facebook Post', description: 'Engaging Facebook post', icon: 'Facebook', systemPrompt: 'You are a Bangladeshi social media copywriter.' },
    { slug: 'PRODUCT_DESCRIPTION', name: 'Product Description', description: 'E-commerce description', icon: 'Package', systemPrompt: 'You are a product copywriter.' },
    { slug: 'SEO_META', name: 'SEO Title & Meta', description: 'SEO optimized', icon: 'Search', systemPrompt: 'You are an SEO expert.' },
    { slug: 'OFFER_POST', name: 'Offer / Promotion', description: 'High-converting offer', icon: 'Tag', systemPrompt: 'You are a promotional copywriter.' },
    { slug: 'BANNER_TEXT', name: 'Banner Text', description: 'Short banner text', icon: 'Image', systemPrompt: 'You are a design copywriter.' },
    { slug: 'REEL_SCRIPT', name: 'Reel Script', description: '30-60s video script', icon: 'Video', systemPrompt: 'You are a video scriptwriter.' },
    { slug: 'IMAGE_PROMPT', name: 'Image Prompt', description: 'Detailed image prompts', icon: 'Sparkles', systemPrompt: 'You are an image prompt engineer.' },
  ];
  for (const t of templates) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: { name: t.name, description: t.description, icon: t.icon, systemPrompt: t.systemPrompt, isActive: true },
      create: t,
    });
  }

  console.log('✅ Database initialization complete!');
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(0); })
  .finally(() => prisma.$disconnect());
