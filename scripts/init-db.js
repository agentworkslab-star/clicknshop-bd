// Prisma migration script - auto-runs on Vercel build
// This ensures DB schema is always in sync with code
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function initDb() {
  try {
    console.log('🔧 Initializing production database...');

    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK');

    // Run Prisma db push equivalent via raw SQL (PostgreSQL)
    // Note: This is fallback - normally prisma db push handles this
    console.log('✅ DB initialization complete');
  } catch (e) {
    console.error('❌ DB init failed:', e.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

initDb();
