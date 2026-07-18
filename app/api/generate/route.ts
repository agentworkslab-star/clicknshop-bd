// AI Generation API Route
// Multi-provider support: LLM7.io (primary) → Groq → Mistral → OpenRouter
// Uses automatic fallback if primary fails

import { NextRequest } from 'next/server';
import { z } from 'zod';
import {
  generateCompletion,
  generateCompletionStream,
  getActiveProvider,
} from '@/lib/groq/client';
import { TEMPLATE_PROMPTS, buildContextInjection, TemplateSlug } from '@/lib/groq/templates';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { stringifyJson } from '@/lib/db-helpers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const generateSchema = z.object({
  template: z.enum([
    'FACEBOOK_POST',
    'PRODUCT_DESCRIPTION',
    'SEO_META',
    'OFFER_POST',
    'BANNER_TEXT',
    'REEL_SCRIPT',
    'IMAGE_PROMPT',
  ]),
  productId: z.string().optional(),  // Optional to avoid UI 400 errors
  language: z.enum(['BN', 'EN', 'MIXED']).optional(),
  tone: z.string().optional(),
  length: z.enum(['SHORT', 'MEDIUM', 'LONG']).optional(),
  emoji: z.boolean().optional(),
  cta: z.boolean().optional(),
  additionalInstructions: z.string().optional(),
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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const parseResult = generateSchema.safeParse(body);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: parseResult.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = parseResult.data;
    const temperature = 0.7;
    const maxTokens = data.length === 'LONG' ? 2048 : data.length === 'SHORT' ? 512 : 1024;
    const model = process.env.LLM7_MODEL || 'codestral-latest';

    // Build context-aware prompt
    const contextMessage = buildContextInjection(
      user.brandName || 'Your Brand',
      data.template,
      {
        productId: data.productId || undefined,
        language: data.language || 'BN',
        tone: data.tone,
        length: data.length || 'MEDIUM',
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

    // Generate streaming response using multi-provider fallback
    const startTime = Date.now();
    const activeProvider = getActiveProvider();
    console.log(`[Generate] Using provider: ${activeProvider}`);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let fullText = '';
        let tokenCount = 0;
        let usedProvider = activeProvider;

        try {
          // Use new multi-provider client with fallback
          const streamBody = await generateCompletionStream(
            [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: contextMessage },
            ],
            { temperature, max_tokens: maxTokens, model }
          );

          const reader = streamBody.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            // Check if it's SSE format (data: ...) or plain text (LLM7.io non-streaming)
            if (text.includes('data: ')) {
              // Parse SSE format
              const lines = text.split('\n').filter((line) => line.startsWith('data: '));
              for (const line of lines) {
                const data = line.replace('data: ', '').trim();
                if (data === '[DONE]') continue;
                try {
                  const json = JSON.parse(data);
                  const content = json.choices?.[0]?.delta?.content || '';
                  if (content) {
                    fullText += content;
                    tokenCount++;
                    controller.enqueue(
                      encoder.encode(
                        `data: ${JSON.stringify({ text: content })}\n\n`
                      )
                    );
                  }
                } catch (e) {
                  // Skip malformed JSON
                }
              }
            } else {
              // Plain text response (LLM7.io non-streaming)
              if (text) {
                fullText = text;
                tokenCount = text.split(/\s+/).length;
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ text })}\n\n`
                  )
                );
              }
            }
          }

          // Save to DB after completion
          try {
            const content = await prisma.generatedContent.create({
              data: {
                userId: user.id,
                productId: data.productId || null,
                templateType: data.template,
                inputData: stringifyJson(data),
                outputText: fullText,
                language: data.language || 'BN',
                tone: data.tone,
                length: data.length || 'MEDIUM',
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

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ done: true, id: content.id, provider: usedProvider })}\n\n`)
            );
          } catch (dbError) {
            console.error('DB save error:', dbError);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          }

          controller.close();
        } catch (err: any) {
          console.error('Stream error:', err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err.message || 'Stream failed' })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
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