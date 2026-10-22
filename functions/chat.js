import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = [resolve(process.cwd(), '.env'), resolve(process.cwd(), '..', '.env')].find(
  (path) => existsSync(path),
);
if (envFile && process.loadEnvFile) {
  process.loadEnvFile(envFile);
}

function getDb() {
  if (getApps().length === 0) {
    const candidatePaths = [
      resolve(process.cwd(), 'serviceAccountKey.json'),
      resolve(process.cwd(), 'src', 'serviceAccountKey.json'),
    ];
    const keyPath = candidatePaths.find((path) => existsSync(path));
    if (keyPath) {
      const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf-8'));
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp();
    }
  }

  return getFirestore();
}

let cachedChunks = null;
let lastCacheTime = 0;
const CACHE_TTL = 10 * 60 * 1000;

async function getIndexedChunks(db) {
  const now = Date.now();
  if (cachedChunks && now - lastCacheTime < CACHE_TTL) {
    return cachedChunks;
  }

  // Updated collection list matching amz-4u Amazon documents
  const collections = [
    'amazon_brand_registry_de',
    'amazon_brand_registry_en',
    'amazon_business_is_it_worth_it_en',
    'amazon_business_lohnt_es_sich_de',
    'amazon_complete_history',
    'amazon_de_top10_de',
    'amazon_de_top10_en',
    'amazon_fba_guide_en',
    'amazon_germany_2026',
    'amazon_geschichte_DE',
  ];

  const chunks = [];
  for (const collection of collections) {
    try {
      const snapshot = await db.collection(collection).get();
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.text && data.embedding) {
          const embedding =
            typeof data.embedding.toArray === 'function'
              ? data.embedding.toArray()
              : Array.isArray(data.embedding)
                ? data.embedding
                : null;

          if (embedding) {
            chunks.push({
              source: data.source || collection,
              text: data.text,
              embedding,
            });
          }
        }
      });
    } catch (error) {
      console.error(`Error loading collection ${collection}:`, error);
    }
  }

  cachedChunks = chunks;
  lastCacheTime = now;
  return chunks;
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

/**
 * @param {{ json: () => Promise<unknown> }} request
 */
export async function handleChatRequest(request) {
  try {
    const payload = await request.json();
    const message =
      payload && typeof payload === 'object' && 'message' in payload ? payload.message : undefined;
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }), {
        status: 500,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const db = getDb();

    // ✅ FIXED: Using valid embedding model
    const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const embedRes = await embedModel.embedContent({
      content: { role: 'user', parts: [{ text: message }] },
      outputDimensionality: 768,
    });
    const queryVector = embedRes.embedding.values;

    const chunks = await getIndexedChunks(db);
    const scored = chunks.map((chunk) => ({
      ...chunk,
      similarity: cosineSimilarity(queryVector, chunk.embedding),
    }));
    scored.sort((a, b) => b.similarity - a.similarity);
    const topChunks = scored.slice(0, 4);

    const citations =
      topChunks.length > 0
        ? [
            {
              text: 'Amazon Marketplace & FBA Guidelines',
              references: topChunks.map((chunk) => ({
                source: chunk.source,
                content: chunk.text,
              })),
            },
          ]
        : [];

    const contextText = topChunks
      .map((chunk, index) => `[Dokument ${index + 1}: ${chunk.source}]\n${chunk.text}`)
      .join('\n\n---\n\n');

    // ✅ FIXED: Using valid generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `Du bist Jeff, ein erfahrener, hilfsbereiter und hochkompetenter Experte für Amazon Marketplace, Brand Registry, Fulfillment by Amazon (FBA) sowie E-Commerce-Strategien in Deutschland und international.
Du unterstützt Verkäufer und Händler dabei, ihre Amazon-Präsenz zu optimieren, Richtlinien einzuhalten und Marktstrategien erfolgreich umzusetzen.

Wichtige Richtlinien:
- Antworte professionell, präzise, lösungsorientiert und leicht verständlich.
- Nutze primär die bereitgestellten Kontextdokumente und Wissensdatenbanken (z. B. Brand Registry Leitfäden, FBA Guides, Amazon Deutschland Analysen), um deine Aussagen fundiert zu belegen.
- Falls die Anfrage auf Deutsch gestellt wird, antworte auf Deutsch. Falls sie auf Englisch gestellt wird, antworte auf Englisch.
- Wenn der Nutzer nach konkreten Schritt-für-Schritt-Anleitungen oder Vorlagen fragt, erstelle strukturierte, sofort anwendbare Übersichten.`,
    });

    const prompt = `Hier ist relevanter Kontext aus der Wissensdatenbank:
${contextText}

Anfrage des Nutzers:
${message}`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (citations.length > 0) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'citations', citations })}\n\n`),
            );
          }

          const result = await model.generateContentStream(prompt);
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'text', content: text })}\n\n`),
              );
            }
          }
        } catch (error) {
          console.error('Chat generation error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                content: error instanceof Error ? error.message : 'Error generating response',
              })}\n\n`,
            ),
          );
        } finally {
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
  } catch (error) {
    console.error('API /api/chat error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal Server Error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}