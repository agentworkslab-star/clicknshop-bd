import { NextRequest } from 'next/server';
import { z } from 'zod';
import { createGroqClient, GROQ_MODELS } from '@/lib/groq/client';
import { TEMPLATE_PROMPTS, buildContextInjection, TemplateSlug } from '@/lib/groq/templates';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { stringifyJson, parseStringArray } from '@/lib/db-helpers';

const requestSchema = z.object({
  template: z.enum(['FACEBOOK_POST', 'PRODUCT_DESCRIPTION', 'SEO_META', 'OFFER_POST', 'BANNER_TEXT', 'REEL_SCRIPT', 'IMAGE_PROMPT']),
  productId: z.string().optional(),
  language: z.enum(['BN', 'EN', 'BI']).default('BN'),
  length: z.enum(['SHORT', 'MEDIUM', 'LONG']).default('MEDIUM'),
  tone: z.string().optional(),
  emoji: z.boolean().default(true),
  cta: z.boolean().default(true),
  additionalInstructions: z.string().optional(),
  // Image Prompt specific
  imagePurpose: z.string().optional(),
  imageStyle: z.string().optional(),
  imageMood: z.string().optional(),
  imageAspect: z.string().optional(),
  imageElements: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const data = requestSchema.parse(body);

    // Check API key
    let apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY সেট করা নেই। Settings এ যান অথবা .env এ যোগ করুন।' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // Strip any wrapping quotes (from env files)
    apiKey = apiKey.trim().replace(/^["']|["']$/g, '');

    // Load brand + product context
    const [brand, product, apiSettings] = await Promise.all([
      prisma.brandMemory.findUnique({ where: { userId: user.id } }),
      data.productId ? prisma.product.findUnique({ where: { id: data.productId, userId: user.id } }) : Promise.resolve(null),
      prisma.apiSettings.findUnique({ where: { userId: user.id } }),
    ]);

    const model = (apiSettings?.modelPreference as any) || GROQ_MODELS.BEST;
    const temperature = apiSettings?.temperature ?? 0.7;
    const maxTokens = apiSettings?.maxTokens ?? 1024;

    // Build context
    const contextMessage = buildContextInjection(
      brand ? {
        brand_name: brand.brandName,
        website: brand.website || undefined,
        phone: brand.phone || undefined,
        whatsapp: brand.whatsapp || undefined,
        facebook_page: brand.facebookPage || undefined,
        cta: brand.ctaDefault || undefined,
        tone: brand.brandTone,
        primary_color: brand.primaryColor || undefined,
        secondary_color: brand.secondaryColor || undefined,
        target_audience: brand.targetAudience || undefined,
        description: brand.description || undefined,
      } : null,
      product ? {
        product_name: product.name,
        category: product.category || undefined,
        weight: product.weight || undefined,
        price: product.price?.toString(),
        regular_price: product.discountPrice?.toString(),
        benefits: parseStringArray(product.benefits),
        seo_keywords: parseStringArray(product.seoKeywords),
        short_desc: product.shortDesc || undefined,
        description: product.longDesc || undefined,
      } : null,
      {
        language: data.language,
        length: data.length,
        emoji: data.emoji,
        cta: data.cta,
        additional_instructions: data.additionalInstructions,
        ...(data.template === 'IMAGE_PROMPT' && {
          image_purpose: data.imagePurpose,
          image_style: data.imageStyle,
          image_mood: data.imageMood,
          image_aspect: data.imageAspect,
          additional_elements: data.imageElements,
        }),
      }
    );

    const systemPrompt = TEMPLATE_PROMPTS[data.template as TemplateSlug];

    // Generate streaming response
    const groq = createGroqClient(apiKey);
    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage },
      ],
      model,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    // Stream response as Server-Sent Events
    const encoder = new TextEncoder();
    let fullText = '';
    let tokenCount = 0;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              fullText += text;
              tokenCount++;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }

          // Save to DB after completion
          try {
            const content = await prisma.generatedContent.create({
              data: {
                userId: user.id,
                productId: data.productId,
                templateType: data.template,
                inputData: stringifyJson(data),
                outputText: fullText,
                language: data.language,
                tone: data.tone,
                length: data.length,
              },
            });

            await prisma.usageLog.create({
              data: {
                userId: user.id,
                templateType: data.template,
                tokensUsed: tokenCount,
                modelUsed: model,
                durationMs: Date.now() - startTime,
                success: true,
              },
            });

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, id: content.id })}\n\n`));
          } catch (dbError) {
            console.error('DB save error:', dbError);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          }

          controller.close();
        } catch (err: any) {
          console.error('Stream error:', err);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err.message || 'Stream failed' })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Generate API error:', error);
    if (error?.issues) {
      return new Response(
        JSON.stringify({ error: error.issues[0]?.message || 'Invalid request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: error.message || 'Generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}